import {
  HomeIcon,
  BellIcon,
  UserIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

import Link from "next/link";

export default function LeftSideBar() {
  return (
    <div className="fixed left-0 h-full w-1/6 shadow-xl bg-gradient-to-br from-purple-950 via-black to-black z-20">
      <div className="flex flex-col items-center h-full mt-24">
        {/* Home Button */}
        <Link href="/">
          <button className="flex items-center justify-center w-16 h-16 bg-white rounded-full hover:bg-gray-300 transition">
            <HomeIcon className="h-12 w-12 text-gray-800" />
          </button>
        </Link>

        <div className="flex flex-col items-center justify-center mt-12 space-y-6">
          {/* Notification Button */}
          <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:bg-gray-300 transition">
            <BellIcon className="h-8 w-8 text-gray-800" />
          </button>

          {/* Profile Button */}
          <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:bg-gray-300 transition">
            <UserIcon className="h-8 w-8 text-gray-800" />
          </button>
          {/* Upload Button */}
          <Link href="/upload">
            <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:bg-gray-300 transition">
              <PlusCircleIcon className="h-8 w-8 text-gray-800" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
