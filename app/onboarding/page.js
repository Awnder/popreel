"use client";

import { useState} from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import InterestButton from "../components/InterestButton";

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
	const [selectedInterests, setSelectedInterests] = useState([]);
	const maxInterests = 5;
	const [error, setError] = useState("");

	const { user } = useUser();
	const router = useRouter();

	const onInterestChange = (interest) => {
		if (selectedInterests.includes(interest)) {
			setSelectedInterests(selectedInterests.filter((i) => i !== interest));
		} else {
			setSelectedInterests([...selectedInterests, interest]);
		}
	};

	const handleSubmit = async () => {
    if (selectedInterests.length > maxInterests) {
      return;
    }

    const res = await completeOnboarding(selectedInterests);
		if (res?.message) {
			// Reloads the user's data from the Clerk API
			await user?.reload();
			router.push("/");
		}
		if (res?.error) {
			setError(res?.error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
      <span className="text-2xl text-center mb-3">What Do You Want To See?</span>
      <span className="text-md text-center mb-3">Select up to five interests</span>
			<div className="flex flex-col justify-between h-[500px] w-[400px] border-2 p-4 rounded-lg">
				<div className="flex flex-wrap gap-4 mt-3">
					{interests.map((interest) => (
						<div key={interest} onClick={() => onInterestChange(interest)}>
							<InterestButton> {interest} </InterestButton>
						</div>
					))}
				</div>
          {selectedInterests.length > maxInterests ? (
            <span className="text-purple-300 italic mt-2">
              You can only select {maxInterests} interests!
            </span>
          ) : (
            <></>
          )}
				<div className=" text-center bg-black border-2 rounded-md p-4 mt-4 hover:bg-purple-800">
					<button onClick={handleSubmit}>
						<span className="text-white">Submit</span>
					</button>
				</div>
			</div>
			{/* <h1>Welcome</h1>
      <form action={handleSubmit}>
        <div>
          <label>Application Name</label>
          <p>Enter the name of your application.</p>
          <input type="text" name="applicationName" required />
        </div>

        <div>
          <label>Application Type</label>
          <p>Describe the type of your application.</p>
          <input type="text" name="applicationType" required />
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
        <button type="submit">Submit</button>
      </form> */}
		</div>
	);
}
