"use client";

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

const videos = [
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

import VideoPlayer from "./components/VideoPlayer";
import LeftSideBar from "./components/LeftSideBar";

export default function Home() {
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
      <LeftSideBar />
      <main className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-none">
        {videos.map((video, index) => (
          <div
            key={index}
            className="w-full h-screen snap-center flex justify-center items-center bg-inherit"
          >
            <VideoPlayer src={video.src} />
          </div>
        ))}
      </main>
    </div>
  );
}
