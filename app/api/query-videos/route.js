import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkSupabaseClientSsr } from "../../../utils/supabase/server";

export async function GET(req) {
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

	const supabase = await createClerkSupabaseClientSsr();

	// call rpc function
	const { data: videos } = await supabase.rpc("query_videos", {
		user_id: userId,
	});

	return NextResponse.json(
		{
			videos,
		},
		{ status: 200 },
	);
}
