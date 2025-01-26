"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton, isSignedIn, useSession, useUser } from "@clerk/nextjs";
import { AiOutlinePlus, AiOutlineArrowLeft } from "react-icons/ai";
import PurpleButton from "./PurpleButton";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TopNav() {
  const pathName = usePathname();

  return (
    <div
      id="TopNav"
      className="fixed bg-gradient-to-r from-purple-950 via-black to-indigo-950 shadow-xl z-30 flex items-center w-full border-black h-[60px]"
    >
      <div className="flex items-center justify-between w-full gap-6 px-10 mx-auto">
        {/* For You Button (Left side) */}
        <div className="flex items-center">
          <p className="text-white font-bold text-2xl mr-4">PopReel</p>
          {pathName === "/upload" ? (
            <button className="flex items-center bg-indigo-50 rounded-xl px-2 py-1 text-black ">
              <Link href="/" className="flex items-center">
                <AiOutlineArrowLeft size={20} />
                <span className="font-medium px-2">Go Back</span>
              </Link>
            </button>
          ) : null}
        </div>

        {/* User Section (Right side) */}
        <div className="flex items-center gap-6">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <PurpleButton>Sign In</PurpleButton>
            </SignInButton>
            <Image
              src="/placeholder-user.jpg"
              alt="placeholder-user"
              width={35}
              height={35}
              className="rounded-full"
            />
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
