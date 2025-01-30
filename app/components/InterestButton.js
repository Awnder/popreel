"use client";

import { useState } from "react";

export default function InterestButton({ children }) {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(!selected);
  }

  return (
    <>
      <button 
        onClick={handleSelect}
        className={
          `${selected 
            ? 'bg-gradient-to-b from-purple-400 to-purple-800 border-2 border-purple-800 text-white px-4 py-2 rounded-md'
            : 'bg-black border-2 border-white text-white px-4 py-2 rounded-md'
          }`
      }>
        {children}
      </button>
    </>
  )
}
