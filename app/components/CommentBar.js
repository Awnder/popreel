import { format } from "date-fns";
import { useEffect, useState } from "react";
import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function CommentBar({
	fetchedComments,
	videoID,
	onClose,
	clerkSession,
	supabase,
}) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const { fullName } = clerkSession.user;
	const initials = `${fullName[0]}${fullName[fullName.lastIndexOf(" ") + 1]}`;

	const handleAddComment = async () => {
		if (!newComment) return;

		const { data: commentData, error: insertError } = await supabase
			.from("comments")
			.insert([
				{
					user_id: clerkSession.user.id,
					video_id: videoID,
					comment_text: newComment,
				},
			]);

		if (insertError)
			console.error("Error adding comment:", insertError.message);
		else {
			setComments((prevComments) => [
				...prevComments,
				{
					user_id: clerkSession.user.id,
					video_id: videoID,
					comment_text: newComment,
					username: fullName,
					initials: initials,
					created_at: new Date().toISOString(),
				},
			]);
		}
		setNewComment("");
	};

	useEffect(() => {
		const fetchUsersAndComments = async () => {
			// Fetch users data once (optimizing by not querying per comment)
			const { data: usersData, error } = await supabase
				.from("users")
				.select("id, first_name, last_name");

			if (error) {
				console.error(error);
				return;
			}

			// Create a map of users by user_id with full name and initials
			const userMap = new Map();
			usersData.forEach((user) => {
				userMap.set(user.id, {
					fullName: `${user.first_name} ${user.last_name}`,
					initials: `${user.first_name[0]}${user.last_name[0]}`,
				});
			});

			// Filter comments based on videoID
			const videoComments = fetchedComments.filter(
				(comment) => comment.video_id === videoID,
			);

			// Add the username and initials to the comments
			const commentsWithUserNamesAndInitials = videoComments.map((comment) => {
				const user = userMap.get(comment.user_id);
				console.log(user);
				return {
					...comment,
					username: user ? user.fullName : "Unknown User",
					initials: user ? user.initials : "UU",
				};
			});

			// Set the comments with the new fields
			setComments(commentsWithUserNamesAndInitials);
		};

		fetchUsersAndComments();
	}, [fetchedComments, videoID]);

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
					{!comments || comments.length === 0 ? (
						<div className="text-white text-center">No comments yet</div>
					) : (
						comments
							.filter((comment) => comment.video_id === videoID)
							.map((comment, index) => (
								<div
									key={index}
									className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-md hover:bg-gray-100 transition-all"
								>
									{/* User Avatar */}
									<div className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full">
										<span className="text-sm font-bold">
											{comment.initials}
										</span>
									</div>

									{/* Comment Text and Details */}
									<div className="flex flex-col text-sm w-full">
										{/* Username */}
										<div className="text-black font-semibold mb-1 truncate">
											{comment.username}
										</div>

										{/* Comment */}
										<div className="text-black break-words px-2 w-full max-w-full overflow-hidden text-ellipsis">
											{comment.comment_text}
										</div>

										{/* Timestamp */}
										<div className="text-gray-400 text-[10px] mt-2 self-end mr-6">
											{isNaN(new Date(comment.created_at).getTime())
												? "Invalid Date"
												: format(
														new Date(comment.created_at),
														"MMM dd, yyyy h:mm a",
												  )}
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
