'use client'

import React from 'react'
import { BiSolidCloudUpload } from 'react-icons/bi'
import PurpleButton from '../components/PurpleButton'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'

export default function Upload() {
  
  const [fileUrl, setFileUrl] = React.useState(null)
  const [fileDate, setFileDate] = React.useState(null)

  const onVideoChange = (event) => {
    const files = event.target.files

    if (files && files.length > 0) {
      const file = files[0]
      console.log(file)
      setFileUrl(file.name + file + Date.now() )
      setFileDate(Date.now())
    }
  }

  React.useEffect(() => {
    console.log(fileUrl)
  }, [fileUrl])

  const clearVideo = () => {
    setFileUrl(null)
    setFileDate(null)
  }
  
  const uploadVideo = async (file) => {
    console.log(file)
    // const cookieStore = await cookies()
    // const supabase = createClient(cookieStore)
  
    // const { data, error } = await supabase.storage.from('videos').upload(`${Date.now()}-${file.name}`, file)
  
    // if (error) {
    //   console.error('upload failed:', error.message)
    // } else {
    //   console.log('upload successful:', data)
    // }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-black to-indigo-950">
        <div className='flex flex-col items-center justify-center w-full h-screen'>
          {fileUrl ? (
            <div className="flex flex-col items-center justify-center h-auto w-[350px]">
              <h1 className='text-3xl font-semibold text-purple-600 mb-5'>Preview Your Video</h1>
              <video src={fileUrl} muted autoPlay loop className="border-2 border-purple-600 rounded-lg" />
              <div className="flex flex-row items-center justify-center w-full my-5 gap-4">
                <PurpleButton onClick={clearVideo}>
                  <div className="flex items-center">
                    <AiOutlineClose color='white' size={20} />
                    <span className="font-medium text-white px-2">Clear Video</span>
                  </div>
                </PurpleButton>
                <PurpleButton onClick={clearVideo}>
                  <div className="flex items-center">
                    <AiOutlinePlus color="white" size={20} />
                    <span className="font-medium text-white px-2">Upload Video</span>
                  </div>
                </PurpleButton>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center w-full'>
              <h1 className='text-3xl font-semibold text-purple-600 mb-5'>Upload a Video</h1>
              <label
                htmlFor="fileInput"
                className="
                  md:mx-0
                  mx-auto
                  mt-4
                  mb-6
                  flex
                  flex-col
                  items-center
                  justify-center
                  w-full
                  max-w-[400px]
                  h-[470px]
                  text-center
                  p-3
                  border-2
                  border-dashed
                  border-purple-100
                  rounded-lg
                  opacity-100
                  hover:opacity-80
                  cursor-pointer
                "
              >
                <BiSolidCloudUpload size="40" color="purple"/>
                <p className="mt-4 text-purple-400">Select video to upload</p>
                <p className="mt-1.5 text-purple-400">Or drag and drop a file</p>
                <p className="mt-12 text-purple-400 text-sm">Type: MP4</p>
                <p className="mt-2 text-purple-400 text-sm">Less than 30mb</p>
                <input
                  type="file"
                  id="fileInput"
                  onChange={onVideoChange}
                  hidden
                  accept=".mp4"
                />
              </label>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
}