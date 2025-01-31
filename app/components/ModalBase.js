"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalBase({ onClose, title, children }) {
  const [domReady, setDomReady] = useState(false);

  const handleCloseClick = (event) => {
    event.preventDefault();
    onClose();
  };

  // render element when the dom is ready using useEffect. doing this bc modals are a little different to display dynamically
  useEffect(() => {
    setDomReady(true);
  }, []);
 
  const modalComponent = (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="flex flex-col w-[400px] h-[500px] bg-black border-2 p-4 rounded-lg">
        <div className="flex flex-row justify-between w-full border-b-2 pb-2">
          {title && <span className="text-white text-xl">{title}</span>}
          <button onClick={handleCloseClick} >
            <AiOutlineClose className="text-white text-2xl" />
            </button>
        </div>
        {children}
      </div>
    </div>
  )

  return domReady ? createPortal(modalComponent, document.body) : null
};
