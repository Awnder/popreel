import { useEffect } from 'react'
import { useSession } from '@clerk/clerk-react'

export default function ClerkSignUpCustom() {
  const { session: clerkSession } = useSession()
  const supabaseClient = createClerkSupabaseClient()
  
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            // The Clerk `session` object has the getToken() method      
            const clerkToken = await clerkSession?.getToken({
              template: 'supabase',
            })
            
            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)
            
            // Call the default fetch
            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      },
    )
  }

  useEffect(() => {
    const validateOrUploadUserToSupabase = async () => {
      if (isSignedIn()) {
        const { id, firstName, lastName, username, primaryEmailAddress } = useUser()
  
        // check if user already exists
        const { data } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', id)
  
        if (data.length === 0) {
          // if not, insert user into supabase
          const { error: insertError } = await supabaseClient
          .from('users')
          .insert([
            {
              id: id,
              first_name: firstName,
              last_name: lastName,
              username: username,
              email: primaryEmailAddress,
            }
          ])
      
          if (insertError) {
            console.error('error', insertError.message)
            return
          }
        }
      }
    }

    // clerkSession.addListener('signUp', validateOrUploadUserToSupabase)

    // return () =>{
    //   clerkSession.removeListener('signUp', validateOrUploadUserToSupabase)
    // }

  }, [isSignedIn, clerkSession])
}