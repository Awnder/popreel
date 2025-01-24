'use client'

import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { AiOutlinePlus } from 'react-icons/ai';
import PurpleButton from './PurpleButton';
import Link from 'next/link';

export default function TopNav() {

    return (
      <>
        <div id="TopNav" className="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
          <div className={"flex items-center justify-end w-full gap-6 px-10 mx-auto"}>
            <SignedIn>
              <PurpleButton>
                <Link href="/upload" className="flex items-center">
                  <AiOutlinePlus color="black" size={20} />
                  <span className="font-medium px-2">Upload</span>
                </Link>
              </PurpleButton>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <PurpleButton>Sign In</PurpleButton>
              </SignInButton>
              <Image src="/placeholder-user.jpg" alt="placeholder-user" width={30} height={30} className="rounded-lg" />
            </SignedOut>
          </div>
        </div>
      </>
    )
}