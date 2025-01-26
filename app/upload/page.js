'use client'

import React from 'react'
import { useSession, useUser, useAuth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { BiSolidCloudUpload } from 'react-icons/bi'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import PurpleButton from '../components/PurpleButton'


export default function Upload() {
  // The `useSession()` hook will be used to get the Clerk `session` object
  const { session: clerkSession } = useSession()
  const { userId: clerkUserId } = useAuth()

	function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            // The Clerk `session` object has the getToken() method      
            const clerkToken = await clerkSession?.getToken({
              template: 'supabase',
            })
            
            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)
            
            // Call the default fetch
            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      },
    )
  }

  const [file, setFile] = React.useState(null)
  const [fileName, setFileName] = React.useState('')
  const [fileUrl, setFileUrl] = React.useState('')

  const onVideoChange = (event) => {
    const files = event.target.files

    if (files && files.length > 0) {
      setFile(files[0])
      setFileName(files[0].name)
      setFileUrl(URL.createObjectURL(files[0]))
    }
  }

  const clearVideo = () => {
    setFile(null)
    setFileName('')
    setFileUrl('')
  }
  
  const uploadVideo = async () => {
    const supabaseClient = createClerkSupabaseClient()

    let fileurl = `${Date.now()}-${fileName}`

    const { error: upsertError } = await supabaseClient.storage
      .from('videos-bucket')
      .upload(fileurl, file)
  
    if (upsertError) {
      console.error('upload failed:', upsertError.message)
      return
    }

    clearVideo()

    const { data: { publicUrl } } = supabaseClient.storage.from('videos').getPublicUrl(fileurl)

    const { error: insertError } = await supabaseClient
      .from('videos')
      .insert([
        {
          user_id: clerkUserId,
          first_name: clerkSession?.user?.firstName,
          last_name: clerkSession?.user?.lastName,
          video_url: publicUrl,
          likes: 0,
          comments: 0,
          embeddings: null,
        },
      ])
    
    if (insertError) {
      console.error('insert failed:', insertError.message)
      return
    }
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
                <PurpleButton onClick={uploadVideo}>
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