import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkSupabaseClientSsr } from "../../../utils/supabase/server";

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

	const user = await currentUser();
	const supabase = await createClerkSupabaseClientSsr();
	const { fileUrl, summary, embeddings, publicUrl } = await req.json();

	const { error: upsertError } = await supabase.from("videos").insert({
		first_name: user?.firstName,
		last_name: user?.lastName,
		video_url: publicUrl,
		likes: 0,
		dislikes: 0,
		comments: 0,
    summary: summary,
		embeddings: embeddings,
	});

	if (upsertError) {
		return NextResponse.json(
			{
				message: upsertError,
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(
		{
			message: "Upload succeeded",
		},
		{ status: 200 },
	);
}
