'use client'

// import { createClient } from '../utils/supabase/server'
// import { cookies } from 'next/headers'

// export default async function Page() {
//   const cookieStore = await cookies()
//   const supabase = createClient(cookieStore)

//   const { data: todos } = await supabase.from('videos').select()

//   return (
//     <ul>
//       {todos?.map((todo) => (
//         <li>{todo}</li>
//       ))}
//     </ul>
//   )
// }

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center jsutify-center">
        <div className='flex flex-col items-center justify-center w-full h-screen'>
          <h1 className='text-4xl font-bold text-purple'>Welcome to the Clerk Next.js App Quickstart</h1>
          <p className='text-purple'>This is a simple Next.js app with Clerk authentication and Supabase storage.</p>
          <p className='text-purple'>To get started, sign up or sign in using the button in the top right corner.</p>
          <div className='flex flex-col items-center justify-center w-[40%]'>
          </div>  
        </div>
      </div>
    </>
  );
}
