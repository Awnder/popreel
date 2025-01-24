'use client'

import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { AiOutlinePlus } from 'react-icons/ai';

const onVideoChange = (event) => {
  const files = event.target.files

  if (files && files.length > 0) {
    const file = files[0]
    const fileUrl = URL.createObjectURL(file)
    const fileDate = Date.now()

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

export default function TopNav() {
    return (
      <>
        <div id="TopNav" className="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
          <div className={"flex items-center justify-end w-full gap-6 px-10 mx-auto"}>
            <SignedIn>
              <button 
                onClick={(event) => {uploadVideo(event.target.files[0])}}
                className="flex items-center border rounded-sm py-[6px] bg-purple-100 hover:bg-purple-300 pl-1.5"
              >
                  <AiOutlinePlus color="black" size={20} />
                  <span className="font-medium px-2">Upload</span>
                  <input type="file" onChange={onVideoChange} hidden accept=".mp4"/>
              </button>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="flex items-center border font-medium rounded-md py-[6px] bg-purple-100 hover:bg-purple-300 p-1.5">
                  Sign In
                </button> 
              </SignInButton>
              <Image src="/images/placeholder-user.jpg" alt="placeholder-user" width={30} height={30} />
            </SignedOut>
          </div>
        </div>
      </>
    )
}