"use client";

import VideoPlayer from "./components/VideoPlayer";
import LeftSideBar from "./components/LeftSideBar";
import CommentBar from "./components/CommentBar";
import { useEffect, useState, useRef } from "react";
import { createClerkSupabaseClient } from "../utils/supabase/client";
import { useSession, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
	const [videos, setVideos] = useState([]);
	const { session: clerkSession } = useSession();
	const firstVideoRef = useRef(null);

	const [fetchedComments, setFetchedComments] = useState([]);
	const [showComments, setShowComments] = useState(false);
	const [currentVideoId, setCurrentVideoId] = useState(null);
	const [supabase, setSupabase] = useState(null);

	const handleScrollToFirstVideo = () => {
		if (firstVideoRef.current) {
			firstVideoRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleCommentBarClick = (videoID) => {
		// Toggle visibility based on videoID
		setShowComments((prev) => (prev ? false : videoID));
		setCurrentVideoId(videoID); // Update the current video ID for comments

		const fetchComments = async () => {
			const supabase = createClerkSupabaseClient(clerkSession);
			const { data, error } = await supabase.from("comments").select("*");

			if (error) console.log("no video with that id", error);

			setFetchedComments(data);
		};
		fetchComments();
	};

	// Callback to update the currentVideoId in Home
	const updateCurrentVideoId = (videoID) => {
		setCurrentVideoId(videoID);
	};

	useEffect(() => {
		if (!clerkSession || !supabase) return;
		// show tables
		const getVideos = async () => {
			const response = await fetch("/api/query-videos");
			const data = await response.json();
			const ragVideos = data.videos;

			const videoData = ragVideos.map((video) => ({
				src: video.video_url,
				id: video.id,
			}));
			setVideos(videoData);
		};

		const fetchComments = async () => {
			const { data, error } = await supabase.from("comments").select();

			if (error) console.log("error fetching comments:", error.message);
			else {
				setFetchedComments(data);
			}
		};
		getVideos();
		fetchComments();
	}, [clerkSession, supabase]);

	useEffect(() => {
		if (!clerkSession) return;
		const supabaseClient = createClerkSupabaseClient(clerkSession);
		setSupabase(supabaseClient);
	}, [clerkSession]);

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
						<SignedIn>
							<button
								onClick={handleScrollToFirstVideo}
								className="mt-8 px-6 py-3 bg-indigo-900 text-indigo-100 font-semibold rounded-full shadow-lg hover:bg-indigo-500 transition"
							>
								Start Watching!
							</button>
						</SignedIn>
						<SignedOut>
							<SignInButton>
								<button className="mt-8 px-6 py-3 bg-indigo-900 text-indigo-100 font-semibold rounded-full shadow-lg hover:bg-indigo-500 transition">
									Start Watching!
								</button>
							</SignInButton>
						</SignedOut>
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
							supabase={supabase}
						/>
					</div>
				))}
			</main>
			{/* Render the single CommentBar */}
			{showComments && (
				<CommentBar
					videoID={currentVideoId} // Pass the current video ID to CommentBar
					fetchedComments={fetchedComments} // Pass the fetched comments to CommentBar
					onClose={() => setShowComments(false)} // Allow closing the CommentBar
					clerkSession={clerkSession}
					supabase={supabase}
				/>
			)}
		</div>
	);
}
