import { auth } from "@clerk/nextjs/server";
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

	const supabase = await createClerkSupabaseClientSsr();
  const formData = await req.formData();
  const file = formData.get("file");
  const fileurl = formData.get("fileurl");

	const { error: upsertError } = await supabase?.storage
	  .from("/videos-bucket/")
	  .upload(fileurl, file);

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
