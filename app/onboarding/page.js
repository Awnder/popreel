"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import InterestButton from "../components/InterestButton";
import { createClerkSupabaseClient } from "../../utils/supabase/client";
import { useSession } from "@clerk/nextjs";

const interests = [
	"Sports",
	"Music",
	"Travel",
	"Technology",
	"Food",
	"Fitness",
	"Movies",
	"Books",
	"Fashion",
	"Gaming",
	"Art",
	"Science",
	"History",
	"Photography",
	"Nature",
];

export default function Onboarding() {
	const { session: clerkSession } = useSession();
	const [supabase, setSupabase] = useState(null);
	const [selectedInterests, setSelectedInterests] = useState([]);
	const [maxInterestsReached, setMaxInterestsReached] = useState(false);
	const maxInterests = 5;
	const [error, setError] = useState("");

	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!clerkSession) return;
		setSupabase(createClerkSupabaseClient(clerkSession));
	}, [clerkSession]);

	const onInterestChange = (interest) => {
		if (selectedInterests.includes(interest)) {
			setSelectedInterests(selectedInterests.filter((i) => i !== interest));
		} else {
			if (selectedInterests.length == maxInterests) {
				setMaxInterestsReached(true);
				// exit function if max interests reached
				return;
			} else {
				setSelectedInterests([...selectedInterests, interest]);
			}
		}
		setMaxInterestsReached(false);
	};

	// calls two functions:
	// 1) _actions.ts to set user interests in clerk metadata
	// 2) api/userupsert/route.ts to set user interests in supabase
	const handleSubmit = async () => {
		if (selectedInterests.length > maxInterests) {
			return;
		}
		const res = await completeOnboarding(selectedInterests);
		if (res?.message) {
			// Reloads the user's data from the Clerk API
			await user?.reload();

			fetch("/api/userupsert", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ interests: selectedInterests }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.json();
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					setError("Error during upload:", error);
				});

			router.push("/"); // automatically redirects to the home page without waiting for supabase to resolve
		}
		if (res?.error) {
			setError(res?.error);
			return;
		}
	};

	useEffect(() => {
		if (!user || !supabase) {
			return;
		}
		//fetch selectedInterests from users table, interests column from supabase
		const fetchInterests = async () => {
			const { data: userInterests, error } = await supabase
				.from("users")
				.select("interests")
				.eq("id", user.id);

			if (error) {
				console.error(error);
				return;
			}
			if (userInterests && userInterests.length > 0) {
				setSelectedInterests(userInterests[0].interests);
			}
		};
		fetchInterests();
	}, [user, supabase]);

	return (
		<div className="flex flex-col items-center h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
			<span className="text-2xl text-center mb-3 font-semibold text-purple-800 mt-16">
				What are your Interests?
			</span>
			<span className="text-sm text-center mb-3 text-indigo-100">
				Select up to {maxInterests} interests
			</span>

			<div className="flex flex-col justify-between w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/4 border-2 p-4 rounded-lg shadow-xl bg-black border-purple-950">
				<div className="flex flex-wrap gap-4 mt-3">
					{interests.map((interest) => (
						<div key={interest} onClick={() => onInterestChange(interest)}>
							<InterestButton selected={selectedInterests.includes(interest)}>
								{interest}
							</InterestButton>
						</div>
					))}
				</div>
				{maxInterestsReached && (
					<span className="text-purple-300 italic mt-2">
						You can only select {maxInterests} interests!
					</span>
				)}
				<button
					className="text-center text-white font-semibold bg-black border-2 rounded-xl p-4 mt-4 hover:bg-gradient-to-br hover:from-purple-700 hover:to-purple-950 hover:scale-105 hover:shadow-lg ease-in-out transition-all duration-300"
					onClick={handleSubmit}
				>
					Submit
				</button>

				{error ? <span className="text-red-500 mt-2">{error}</span> : <></>}
			</div>
		</div>
	);
}
