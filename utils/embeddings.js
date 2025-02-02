import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbeddings = async (text) => {
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
