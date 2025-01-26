import React from "react";

const PurpleButton = React.forwardRef((props, ref) => {
  return (
    <button
      className="flex items-center border rounded-lg px-[10px] py-[6px] bg-purple-700 border-black hover:bg-purple-400 font-semibold"
      ref={ref}
      {...props}
    />
  );
});

export default PurpleButton;
