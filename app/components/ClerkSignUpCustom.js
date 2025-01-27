import { useEffect } from "react";
import { useSession } from "@clerk/clerk-react";
import { createClerkSupabaseClient } from "../utils/supabase/client";

export default function ClerkSignUpCustom() {
  const { session: clerkSession } = useSession();
  const supabaseClient = createClerkSupabaseClient();

  useEffect(() => {
    const validateOrUploadUserToSupabase = async () => {
      if (isSignedIn()) {
        const { id, firstName, lastName, username, primaryEmailAddress } =
          useUser();

        // check if user already exists
        const { data } = await supabaseClient
          .from("users")
          .select("*")
          .eq("id", id);

        if (data.length === 0) {
          // if not, insert user into supabase
          const { error: insertError } = await supabaseClient
            .from("users")
            .insert([
              {
                id: id,
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: primaryEmailAddress,
              },
            ]);

          if (insertError) {
            console.error("error", insertError.message);
            return;
          }
        }
      }
    };

    // clerkSession.addListener('signUp', validateOrUploadUserToSupabase)

    // return () =>{
    //   clerkSession.removeListener('signUp', validateOrUploadUserToSupabase)
    // }
  }, [isSignedIn, clerkSession]);
}
