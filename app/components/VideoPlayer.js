import React, { useRef, useEffect } from "react";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play(); // Play video when it comes into view
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
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play(); // Play video on click
    } else {
      videoRef.current.pause(); // Pause video on click
    }
  };

  return (
    <div className="w-2/3 h-full flex justify-center items-center relative bg-inherit">
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        src={src}
        className="object-cover h-full w-full"
        autoPlay
        loop //
        muted // Mute the video to play it automatically (required by most browsers?)
      />
      {/* Button Container */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-8">
        {/* Like Button */}
        <button className="text-white  rounded-full p-3 hover:bg-gray-700 transition">
          👍
        </button>

        {/* Dislike Button */}
        <button className="text-white bg-gray-800 rounded-full p-3 hover:bg-gray-700 transition">
          👎
        </button>

        {/* Comment Button */}
        <button className="text-white bg-gray-800 rounded-full p-3 hover:bg-gray-700 transition">
          💬
        </button>

        {/* Share Button */}
        <button className="text-white bg-gray-800 rounded-full p-3 hover:bg-gray-700 transition">
          🔗
        </button>
      </div>
    </div>
  );
}
