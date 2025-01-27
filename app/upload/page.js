"use client";

import React, { useState } from "react";
import { useSession, useUser, useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { BiSolidCloudUpload } from "react-icons/bi";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import PurpleButton from "../components/PurpleButton";
import { createClerkSupabaseClient } from "../../utils/supabase/client";


export default function Upload() {
  // The `useSession()` hook will be used to get the Clerk `session` object
  const { session: clerkSession } = useSession();
  const { userId: clerkUserId } = useAuth();

  // function createClerkSupabaseClient() {
  //   return createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  //     {
  //       global: {
  //         // Get the custom Supabase token from Clerk
  //         fetch: async (url, options = {}) => {
  //           // The Clerk `session` object has the getToken() method
  //           const clerkToken = await clerkSession?.getToken({
  //             template: "supabase",
  //           });

  //           // Insert the Clerk Supabase token into the headers
  //           const headers = new Headers(options?.headers);
  //           headers.set("Authorization", `Bearer ${clerkToken}`);

  //           // Call the default fetch
  //           return fetch(url, {
  //             ...options,
  //             headers,
  //           });
  //         },
  //       },
  //     }
  //   );
  // }

  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onVideoChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
      setFileName(files[0].name);
      setFileUrl(URL.createObjectURL(files[0]));
    }
  };

  const clearVideo = () => {
    setFile(null);
    setFileName("");
    setFileUrl("");
  };

  const uploadVideo = async () => {
    const supabaseClient = createClerkSupabaseClient();

    try {
      setIsLoading(true); // Start loading state
      setErrorMessage(""); // Reset previous errors

      let fileurl = `${Date.now()}-${fileName}`;
      console.log("fileurl", fileurl);

      // Upload the video file to Supabase storage
      const { error: upsertError } = await supabaseClient.storage
        .from("videos-bucket")
        .upload(fileurl, file);

      if (upsertError) {
        setErrorMessage(`Upload failed: ${upsertError.message}`);
        console.error("Upload failed:", upsertError.message);
        setIsLoading(false);
        clearVideo(); // Clear the video state after successful upload
        return;
      }
      console.log("video uploaded to blob storage");

      // Get the public URL of the uploaded video
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("videos").getPublicUrl(fileurl);

      console.log("publicUrl", publicUrl);

      // Insert video metadata into Supabase database
      const { error: insertError } = await supabaseClient
        .from("videos")
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
        ]);

      if (insertError) {
        setErrorMessage(`Insert failed: ${insertError.message}`);
        console.error("Insert failed:", insertError.message);
        setIsLoading(false);
        clearVideo(); // Clear the video state after successful upload
        return;
      }
      console.log("video uploaded to db");

      clearVideo(); // Clear the video state after successful upload
    } catch (error) {
      if (error instanceof Error) {
        // If the error is an instance of the Error object, log it with a specific message
        setErrorMessage(`Unexpected error occurred: ${error.message}`);
        console.error("Unexpected error:", error.message);
      } else {
        // If it's not an instance of Error, log a more general error message
        setErrorMessage("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false); // Stop loading state regardless of success or failure
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-black to-indigo-950 overflow-hidden">
      {fileUrl ? (
        <div className="flex flex-col items-center justify-center max-h-screen w-[350px]">
          <h1 className="text-3xl font-semibold text-purple-600 mb-5">
            Preview Your Video
          </h1>
          <div className="w-full overflow-hidden">
            <video
              src={fileUrl}
              muted
              autoPlay
              loop
              className="border-2 border-purple-600 rounded-lg w-full h-auto max-h-[400px] object-cover"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full my-5 gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-4 border-t-4 border-purple-600 border-solid rounded-full spinner"></div>
                <span className="text-white">Uploading...</span>
              </div>
            ) : (
              <>
                <PurpleButton onClick={clearVideo}>
                  <div className="flex items-center">
                    <AiOutlineClose color="white" size={20} />
                    <span className="font-medium text-white px-2">
                      Clear Video
                    </span>
                  </div>
                </PurpleButton>
                <PurpleButton onClick={uploadVideo}>
                  <div className="flex items-center">
                    <AiOutlinePlus color="white" size={20} />
                    <span className="font-medium text-white px-2">
                      Upload Video
                    </span>
                  </div>
                </PurpleButton>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full pb-14">
          <h1 className="text-3xl font-semibold text-purple-600">
            Upload a Video
          </h1>
          <label
            htmlFor="fileInput"
            className="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[400px] h-[470px] text-center p-3 border-2 border-dashed border-purple-100 rounded-lg opacity-100 hover:opacity-80 cursor-pointer"
          >
            <BiSolidCloudUpload size="40" color="purple" />
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
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
