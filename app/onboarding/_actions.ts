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
			},
		});

    const authData = await auth().catch(() => null);
    const userData = await client.users.getUser(userId);
    const supabase = createClerkSupabaseClient(await authData?.getToken());

    const { data, error } = await supabase.from('users').upsert({
      id: userId,
      first_name: userData?.firstName,
      last_name: userData?.lastName,
	    initial: userData?.firstName && userData?.lastName ? userData.firstName.charAt(0) + userData.lastName.charAt(0) : null,
      interests: interests,
    });

		return { message: res.publicMetadata };
	} catch (err) {
		return { error: "There was an error updating the user metadata", err };
	}
};
