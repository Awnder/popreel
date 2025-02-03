"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbeddings } from "../../../utils/embeddings";
import { prompt } from "../../../utils/prompts";
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

		// wait for ACTIVE file
		let file = await fileManager.getFile(uploadResponse.file.name);
		while (file.state === FileState.PROCESSING) {
			process.stdout.write(".");
			// Sleep for 10 seconds
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			// Fetch the file from the API again
			file = await fileManager.getFile(uploadResponse.file.name);
		}

    // Step 3: Process video with Gemini
		const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const result = await model.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
					fileUri: uploadResponse.file.uri,
				},
			},
			{
				text: prompt,
			},
		]);

		let embeddings = [];
		try {
			embeddings = await generateEmbeddings(result.response.text());
		} catch (error) {
			console.error("Error during embedding generation:", error);
			return NextResponse.json(
				{
					message: `Error during embedding generation: ${error.message}`,
				},
				{ status: 500 },
			);
		}

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
