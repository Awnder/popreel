import React from "react"

const PurpleButton = React.forwardRef((props, ref) => {
  return (
    <button className="flex items-center border rounded-sm px-[5px] py-[6px] bg-purple-100 hover:bg-purple-300" ref={ref} {...props} />
  )
})

export default PurpleButton