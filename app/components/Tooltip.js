import { useState } from "react";

export default function Tooltip({ children, text }) {
	const [show, setShow] = useState(false);

	return (
		<div
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
      className="relative inline-block flex items-center justify-center"
		>
			{show && (
				<div className="absolute translate-y-[-200%] text-center bg-gray-600 text-white px-1 text-sm rounded-md z-10">
					{text}
				</div>
			)}
			{children}
		</div>
	);
}
