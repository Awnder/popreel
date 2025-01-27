import { format } from "date-fns";
import { useState } from "react";
import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/outline";

const mockComments = [
  {
    videoID: "1",
    user: "Usesadsadr1",
    comment: "This is a comment on video 1",
    timestamp: new Date("2025-01-25T12:00:00Z"),
  },
  {
    videoID: "1",
    user: "User Last Name2",
    comment: "This is another comment on video 1",
    timestamp: new Date("2025-01-25T12:05:00Z"),
  },
  {
    videoID: "2",
    user: "User1",
    comment: "This is a comment on video 2",
    timestamp: new Date("2025-01-25T12:00:00Z"),
  },
  {
    videoID: "2",
    user: "User2",
    comment: "This is another comment on video 2",
    timestamp: new Date("2025-01-25T12:05:00Z"),
  },
  {
    videoID: "3",
    user: "User1",
    comment: "This is a comment on video 3",
    timestamp: new Date("2025-01-25T12:00:00Z"),
  },
  {
    videoID: "3",
    user: "User2",
    comment: "This is another comment on video 3",
    timestamp: new Date("2025-01-25T12:05:00Z"),
  },
  {
    videoID: "4",
    user: "User1",
    comment: "This is a comment on video 4",
    timestamp: new Date("2025-01-25T12:00:00Z"),
  },
  {
    videoID: "4",
    user: "User2",
    comment: "This is another comment on video 4",
    timestamp: new Date("2025-01-25T12:05:00Z"),
  },
  {
    videoID: "5",
    user: "User1",
    comment: "This is a comment on video 5",
    timestamp: new Date("2025-01-25T12:00:00Z"),
  },
  {
    videoID: "5",
    user: "User2",
    comment: "This is another comment on video 5",
    timestamp: new Date("2025-01-25T12:05:00Z"),
  },
];

export default function CommentBar({ fetchedComments, videoID, onClose }) {
  // console.log(videoID);
  const [comments, setComments] = useState(fetchedComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (newComment.trim()) {
      setComments((prevComments) => [
        prevComments,
        {
          user_id: clerkSession.user.id,
          video_id, videoID,
          comment_text: newComment,
        },
      ]);
      setNewComment("");
    }

    const { error: insertError } = await supabase
      .from("comments")
      .insert([
        {
          user_id: clerkSession.user.id,
          video_id: videoID,
          comment_text: newComment,
        },
      ]);

    if (insertError) console.error("Error adding comment:", insertError.message);

    setComments(commentData);
  };

  return (
    <div className="fixed right-0 h-full w-1/6 bg-gradient-to-tr from-indigo-950 via-black to-indigo-950 z-20 shadow-lg pb-12 mt-1">
      <div className="flex flex-col items-center justify-start py-4 h-full">
        {/* Header with Close Button */}
        <div className="w-full flex justify-between items-center px-4 pb-2 border-b border-gray-700">
          <h2 className="text-lg font-bold">Comments</h2>
          <button onClick={onClose} className="text-white px-3 py-1 rounded-lg">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Display Comments */}
        <div className="space-y-4 w-full px-2 flex-1 overflow-y-auto mt-4">
          {!comments ? (
            <div className="text-white text-center">No comments yet</div>
          ) : (
            comments
            .filter((comment) => comment.video_id === videoID)
            .map((comment, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-md hover:bg-gray-100 transition-all"
              >
                {/* User Avatar */}
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full">
                  <span className="text-lg font-bold">{comment.user_id}</span>
                </div>

                {/* Comment Text and Timestamp */}
                <div className="flex flex-col text-sm w-full">
                  {/* Username */}
                  <div className="text-black font-semibold mb-1">
                    {comment.user_id}
                  </div>

                  {/* Comment */}
                  <span className="text-black break-words px-2">
                    {comment.comment_text}
                  </span>

                  {/* Timestamp */}
                  <div className="text-gray-400 text-[10px] mt-2 ml-auto self-end">
                    {format(new Date(comment.created_at), "MMM dd, yyyy h:mm a")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input */}
        <div className="w-full p-4 bg-indigo-950 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="cool video!"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              className="w-full p-2 text-sm bg-indigo-50 placeholder:text-gray-500 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
