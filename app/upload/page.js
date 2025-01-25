'use client'

import React from 'react'
import { BiSolidCloudUpload } from 'react-icons/bi'

export default function Upload() {
  
  const [fileUrl, setFileUrl] = React.useState(null)
  const [fileDate, setFileDate] = React.useState(null)


  const onVideoChange = (event) => {
    const files = event.target.files
  
    if (files && files.length > 0) {
      const file = files[0]
      const fileUrl = URL.createObjectURL(file)
      const fileDate = Date.now()
      console.log(fileUrl)
      console.log(fileDate)
    }
  }
  
  const uploadVideo = async (file) => {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
  
    const { data, error } = await supabase.storage.from('videos').upload(`${Date.now()}-${file.name}`, file)
  
    if (error) {
      console.error('upload failed:', error.message)
    } else {
      console.log('upload successful:', data)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-black to-indigo-950">
        <div className='flex flex-col items-center justify-center w-full h-screen'>
          <h1 className='text-3xl font-semibold text-purple-900 mb-5'>Upload a Video</h1>
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
                hover:bg-purple-100
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
      </div>
    </>
  );
}