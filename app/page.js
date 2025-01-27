"use client";

import VideoPlayer from "./components/VideoPlayer";
import LeftSideBar from "./components/LeftSideBar";
import CommentBar from "./components/CommentBar";
// import { createClient } from "../utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { createClerkSupabaseClient } from "../utils/supabase/client";
import { useSession } from "@clerk/nextjs";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const { session: clerkSession } = useSession();
  const firstVideoRef = useRef(null);

  const [fetchedComments, setFetchedComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const handleScrollToFirstVideo = () => {
    if (firstVideoRef.current) {
      firstVideoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    if (!clerkSession) return;
    const supabase = createClerkSupabaseClient(clerkSession);
    // show tables
    const getVideos = async () => {
      const { data: videos, error } = await supabase.from("videos").select();
      if (error) console.log("error:", error.message);
      console.log("videos", videos);

      const videoData = videos.map((video) => ({
        src: video.video_url,
        id: video.id,
      }));
      setVideos(videoData);
    };
    getVideos();
  }, [clerkSession]);

  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClerkSupabaseClient(clerkSession);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("video_id", currentVideoId);

      if (error) console.log("no video with that id", error);

      setFetchedComments(data);
    } 
    fetchComments();
  }, [clerkSession])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
      <LeftSideBar />

      <main className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-none no-scrollbar">
        {/* Intro Section */}
        <div
          className="w-full h-screen snap-center flex justify-center items-center bg-inherit"
          htmlFor={`intro-section`}
        >
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold text-white animate-fadeInUp">
              <span className="block text-indigo-500 mb-8">
                Welcome to PopReeeel!
              </span>
            </h1>

            {/* Scroll Down Button */}
            <button
              onClick={handleScrollToFirstVideo}
              className="mt-8 px-6 py-3 bg-indigo-900 text-indigo-100 font-semibold rounded-full shadow-lg hover:bg-indigo-500 transition"
            >
              Start Watching!
            </button>
          </div>
        </div>

        {/* Video Sections */}
        {videos.map((video, index) => (
          <div
            key={index}
            className="w-full h-screen snap-center flex justify-center items-center bg-inherit"
            htmlFor={`video-${video.id}`}
            ref={index === 0 ? firstVideoRef : null} // Set reference for the first video
          >
            <VideoPlayer
              src={video.src}
              videoID={video.id} // Pass the video ID to VideoPlayer
              handleCommentBarClick={handleCommentBarClick}
              updateCurrentVideoId={updateCurrentVideoId} // Pass the callback
            />
            {/* Render CommentBar only if showComments matches the videoID */}
            {showComments && <CommentBar videoID={currentVideoId} fetchedComments={fetchedComments} />}
          </div>
        ))}
      </main>
      {/* Render the single CommentBar */}
      {showComments && (
        <CommentBar
          videoID={currentVideoId} // Pass the current video ID to CommentBar
          fetchedComments={fetchedComments} // Pass the fetched comments to CommentBar
          onClose={() => setShowComments(false)} // Allow closing the CommentBar
        />
      )}
    </div>
  );
}
