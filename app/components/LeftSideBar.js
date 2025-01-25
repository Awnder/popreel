import Image from "next/image";

export default function LeftSideBar() {
  return (
    <div className="fixed left-0 top-0 h-full w-1/6 bg-gradient-to-r from-purple-950 via-black to-indigo-950 z-20">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
          <Image
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
            <Image
              src="/home.svg"
              alt="home"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
            <Image
              src="/search.svg"
              alt="search"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
            <Image
              src="/upload.svg"
              alt="upload"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
            <Image
              src="/notification.svg"
              alt="notification"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
            <Image
              src="/profile.svg"
              alt="profile"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
