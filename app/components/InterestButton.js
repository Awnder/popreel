"use client";

export default function InterestButton({ children, selected }) {
	return (
		<>
			<button
				className={`
    ${
			selected
				? "bg-gradient-to-b from-purple-400 to-purple-900 border-2 border-purple-800 "
				: "bg-black border-2 border-white"
		}
    hover:scale-105 
    hover:shadow-lg 
    transition-all 
    duration-300 
    ease-in-out
    rounded-xl
    text-white px-4 py-2
    ${selected ? "hover:text-purple-950" : "hover:text-purple-800"}
  `}
			>
				{children}
			</button>
		</>
	);
}
