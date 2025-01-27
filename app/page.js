"use client";

const videos = [
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    id: "1",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    id: "2",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    id: "3",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    id: "4",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    id: "5",
  },
];

import VideoPlayer from "./components/VideoPlayer";
import LeftSideBar from "./components/LeftSideBar";
import CommentBar from "./components/CommentBar";
// import { createClient } from "../utils/supabase/client";
import { useEffect, useState } from "react";
import { createClerkSupabaseClient } from "../utils/supabase/client";
import { useSession } from "@clerk/nextjs";

export default function Home() {
  const { session: clerkSession } = useSession();
  
  const [showComments, setShowComments] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const handleCommentBarClick = (videoID) => {
    // Toggle visibility based on videoID
    setShowComments((prev) => (prev ? false : videoID));
    setCurrentVideoId(videoID); // Update the current video ID for comments
  };

  // Callback to update the currentVideoId in Home
  const updateCurrentVideoId = (videoID) => {
    setCurrentVideoId(videoID);
  };

  useEffect(() => {
    const supabase = createClerkSupabaseClient(clerkSession);
    // show tables
    const getVideos = async () => {
      const { data: videos, error } = await supabase.from("videos").select();
      if (error) console.log("error", error);
      console.log("videos", videos);
    };
    getVideos();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
      <LeftSideBar />
      <main className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-none no-scrollbar">
        {videos.map((video, index) => (
          <div
            key={index}
            className="w-full h-screen snap-center flex justify-center items-center bg-inherit "
            htmlFor={`video-${video.id}`}
          >
            <VideoPlayer
              src={video.src}
              videoID={video.id} // Pass the video ID to VideoPlayer
              handleCommentBarClick={handleCommentBarClick}
              updateCurrentVideoId={updateCurrentVideoId} // Pass the callback
            />
            {/* Render CommentBar only if showComments matches the videoID */}
            {showComments && <CommentBar videoID={currentVideoId} />}
          </div>
        ))}
      </main>
      {/* Render the single CommentBar */}
      {showComments && (
        <CommentBar
          videoID={currentVideoId} // Pass the current video ID to CommentBar
          onClose={() => setShowComments(false)} // Allow closing the CommentBar
        />
      )}
    </div>
  );
}
