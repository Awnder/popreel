"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AiOutlinePlus, AiOutlineArrowLeft } from "react-icons/ai";
import PurpleButton from "./PurpleButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathName = usePathname();

  return (
    <>
      <div
        id="TopNav"
        className="fixed bg-gradient-to-r from-purple-950 via-black to-indigo-950 shadow-xl z-30 flex items-center w-full  border-black h-[60px]"
      >
        <div
          className={"flex items-center justify-end w-full gap-6 px-10 mx-auto"}
        >
          <SignedIn>
            { pathName === '/upload' ? (
              <PurpleButton>
                <Link href="/" className="flex items-center">
                  <AiOutlineArrowLeft color="white" size={20} />
                  <span className="font-medium text-white px-2">For You</span>
                </Link>
              </PurpleButton>
            ) : (
              <div>
                <PurpleButton>
                  <Link href="/upload" className="flex items-center">
                    <AiOutlinePlus color="white" size={20} />
                    <span className="font-medium text-white px-2">Upload</span>
                  </Link>
                </PurpleButton>
              </div>
            )}
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
    </>
  );
}
