"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "../../utils/supabase/client";

export const completeOnboarding = async (interests: Array<String>) => {
	const { userId } = await auth();

	if (!userId) {
		return { message: "No Logged In User" };
	}

	const client = await clerkClient();

	try {
		const res = await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				interests: interests,
			},
		});

		return { message: res.publicMetadata };
	} catch (err) {
		return { error: "There was an error updating the user metadata", err };
	}
};
