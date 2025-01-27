'use client'

// import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
// import { useSession } from "@clerk/nextjs";
// export function createClient() {
//   // Create a supabase client on the browser with project's credentials
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL as string,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
//   );
// }

export function createClerkSupabaseClient(clerkSession: any) {
    // const { session: clerkSession } = useSession();

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            // The Clerk `session` object has the getToken() method
            const clerkToken = await clerkSession?.getToken({
              template: "supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            // Call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }
