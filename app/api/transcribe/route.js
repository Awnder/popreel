"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req) {
	const authData = await auth().catch(() => null);
	const userId = authData?.userId;

	if (!userId) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 },
		);
	}

	const formData = await req.formData();
	const videoUrl = formData.get("publicUrl");

	try {
		// Step 1: Download video to temporary directory
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "video-"));
		const tempFilePath = path.join(tempDir, "temp_video.mp4");

		const response = await fetch(videoUrl);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFileSync(tempFilePath, buffer);

		// Step 2: Upload video to Google AI FileManager
		const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
		const uploadResponse = await fileManager.uploadFile(tempFilePath, {
			mimeType: "video/mp4",
			displayName: "Temporary Video for Processing",
		});

		// Step 3: Process video with Gemini
		const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		// wait for ACTIVE file
		let file = await fileManager.getFile(uploadResponse.file.name);
		while (file.state === FileState.PROCESSING) {
			process.stdout.write(".");
			// Sleep for 10 seconds
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			// Fetch the file from the API again
			file = await fileManager.getFile(uploadResponse.file.name);
		}

		const result = await model.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
          // Be careful with passing the fileUri. It becomes a part of the summary and can be exposed to the user.
					fileUri: uploadResponse.file.uri,
				},
			},
			{
				text: "Summarize the main points of this video in two to five sentences.",
			},
		]);

		const embeddings = await generateEmbeddings(result.response.text());

		// Step 4: Clean up
		fs.rmSync(tempDir, { recursive: true, force: true });
		await fileManager.deleteFile(uploadResponse.file.name);

		return NextResponse.json(
			{
				message: "Transcription succeeded",
				summary: result.response.text(),
				embeddings: embeddings,
			},
			{ status: 200 },
		);
	} catch (error) {
		// clean up temp directory
		fs.rmSync(tempDir, { recursive: true, force: true });
		console.error(error);
		return NextResponse.json(
			{
				message: error.message,
			},
			{ status: 500 },
		);
	}
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const generateEmbeddings = async (text) => {
	try {
		const embeddings = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: text,
		});

		return embeddings.data[0].embedding;
	} catch (error) {
		console.error("Error during embedding generation:", error);
		throw error;
	}
};
