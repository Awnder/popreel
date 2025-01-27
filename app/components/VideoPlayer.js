import React, { useRef, useEffect, useState } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"; // Millions
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"; // Thousands
  return num.toString(); // Less than 1000
}

export default function VideoPlayer({
  src,
  videoID,
  handleCommentBarClick,
  updateCurrentVideoId,
  supabase,
}) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null); // State to track video errors
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDislikled] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data: likes, error: likesError } = await supabase
        .from("videos")
        .select("likes")
        .eq("id", videoID);
      setLikes(likes[0].likes);
    };
    const fetchDislikes = async () => {
      const { data: dislikes, error: dislikesError } = await supabase
        .from("videos")
        .select("dislikes")
        .eq("id", videoID);
      setDislikes(dislikes[0].dislikes);
    };

    fetchLikes();
    fetchDislikes();
  }, [videoID]);

  const handleLikeClick = async () => {
    if (liked) return;

    const { data: update, error: updateError } = await supabase
      .from("videos")
      .update({ likes: likes + 1 })
      .eq("id", videoID)
      .select();

    if (error) {
      console.error("Error updating likes:", error);
    } else {
      setLiked(true);
      setDislikled(false);
      setLikes(likes + 1);
    }
  };

  const handleDislikeClick = async () => {
    if (disliked) return;
    const { data: update, error: updateError } = await supabase
      .from("videos")
      .update({ dislikes: dislikes + 1 })
      .eq("id", videoID)
      .select();

    if (error) {
      console.error("Error updating dislikes:", error);
    } else {
      setLiked(false);
      setDislikled(true);
      setDislikes(dislikes + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current
              .play()
              .catch((err) => setError("Failed to play video"));
            updateCurrentVideoId(videoID); // Update the current video ID in Home
          } else {
            videoRef.current.pause(); // Pause video when it goes out of view
          }
        }
      },
      {
        threshold: 0.5, // Trigger the callback when 50% of the video is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // Cleanup the observer when the component is unmounted
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoID, updateCurrentVideoId]);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => setError("Failed to play video"));
    } else {
      videoRef.current.pause(); // Pause video on click
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    // Copy the link to the clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Show the pop-up
      setCopied(true);

      // Hide the pop-up after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="w-2/3 h-full flex justify-center items-center relative bg-inherit">
      <div className="w-5/6 relative">
        {/* Add relative to the parent container */}
        <video
          ref={videoRef}
          onClick={handleVideoClick}
          src={src}
          className="object-cover w-full mt-[-40px]" // Added negative margin to move the video up
          autoPlay
          loop
        />
        {/* Button Container */}
        <div className="absolute right-8 top-[calc(46%)] transform -translate-y-1/2 flex flex-col space-y-8 text-indigo-200">
          {/* Like Button */}
          <button
            className={`bg-indigo-950 rounded-full p-3 hover:bg-indigo-900 active:scale-90 transition relative overflow-hidden ${
              liked ? "scale-110" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              createRipple(e);
              handleLikeClick();
            }}
          >
            <div className="flex items-center gap-3">
              <HandThumbUpIcon className="w-6 h-6 text-white" />
              <span className="text-white">{formatNumber(likes)}</span>
            </div>
          </button>

          {/* Dislike Button */}
          <button
            className={`bg-indigo-950 rounded-full p-3 hover:bg-indigo-900 active:scale-90 transition relative overflow-hidden ${
              disliked ? "scale-110" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              createRipple(e);
              handleDislikeClick();
            }}
          >
            <div className="flex items-center gap-3">
              <HandThumbDownIcon className="w-6 h-6 text-white" />
              <span className="text-white">{formatNumber(dislikes)}</span>
            </div>
          </button>

          {/* Comment Button */}
          <button
            className="bg-indigo-950 rounded-full p-3 hover:bg-indigo-900 transition flex items-center justify-center"
            onClick={handleCommentBarClick}
          >
            <ChatBubbleBottomCenterIcon className="w-6 h-6 text-white" />
          </button>

          {/* Share Button */}
          <button
            className="bg-indigo-950 rounded-full p-3 hover:bg-indigo-900 transition flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              handleShareClick();
            }}
          >
            <ShareIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Pop-up message when link is copied */}
        {copied && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-indigo-950 text-white rounded-lg py-2 px-4 shadow-md">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
