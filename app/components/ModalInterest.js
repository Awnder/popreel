"use client";

import { useState } from "react";
import BaseModal from "./ModalBase";
import InterestButton from "./InterestButton";

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

export default function ModalInterest() {
	const [showModal, setShowModal] = useState(false);
	const [selectedInterests, setSelectedInterests] = useState([]);
	const maxInterests = 5;

  const handleModal = () => {
    setShowModal(!showModal);
    setSelectedInterests([]);
  }

	const onInterestChange = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < maxInterests) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      return;
    }
	};

	return (
		<div>
			<button onClick={handleModal}>Show Modal</button>
			{showModal && (
				<BaseModal
					onClose={() => setShowModal(false)}
					title={"Choose Your Interests"}
				>
					<div className="flex flex-col justify-between h-full">
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
						<div className=" text-center bg-black border-2 rounded-md p-4 mt-4 hover:bg-purple-700">
							<button onClick={() => console.log(selectedInterests)}>
								<span className="text-white">Submit</span>
							</button>
						</div>
					</div>
				</BaseModal>
			)}
		</div>
	);
}
