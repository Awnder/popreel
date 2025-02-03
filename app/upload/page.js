"use client";

import { useState } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import PurpleButton from "../components/PurpleButton";
import { createClerkSupabaseClient } from "../../utils/supabase/client";
import { useSession } from "@clerk/nextjs";

export default function Upload() {
	const { session } = useSession();

	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [status, setStatus] = useState("Uploading");

	const onVideoChange = (event) => {
    const files = event.target.files;

    if (!files[0] || files.length === 0) {
      setErrorMessage("Please select a video file to upload.");
      setFile(null);
      return;
    }

    setFile(files[0]);
    setFileName(files[0].name);
    setFileUrl(URL.createObjectURL(files[0]));
	};

	const clearVideo = () => {
		setFile(null);
		setFileName("");
		setFileUrl("");
	};

  const videoValidation = () => {
    // checks if the video file is less than 25MB and less than 30 seconds
    // creates a promise to wait for the video metadata to load
    return new Promise((resolve, reject) => {
      if (file.size > 25000000) {
        setErrorMessage("File size too large. Please upload a file less than 25MB.");
        console.log('Video size too large');
        return resolve(false);
      }
  
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);
  
      videoElement.onloadedmetadata = () => {
        const durationInSeconds = videoElement.duration;
        const maxDuration = 30;
  
        if (durationInSeconds >= maxDuration) {
          setErrorMessage("Video duration too long. Please upload a video less than 30 seconds.");
          console.log("Video duration too long");
          return resolve(false);
        }
        resolve(true);
      };
  
      videoElement.onerror = () => {
        setErrorMessage("Error loading video metadata.");
        console.log("Error loading video metadata");
        resolve(false);
      };
    });
  };

	const uploadVideo = async () => {
		setIsLoading(true);
		setSuccessMessage("");
		setErrorMessage("");

    const success = await videoValidation();

    if (!success) {
      clearVideo();
      setIsLoading(false);
      console.log("Video validation failed");
      return;
    }

		const formData = new FormData();
		const fileUrl = `${Date.now()}-${fileName}`;
		formData.append("file", file);
		formData.append("filename", fileName);
		formData.append("fileurl", fileUrl);
		setStatus("Uploading Video");

		try {
			// 1. Upload the video to the supabase bucket
			const bucketResponse = await fetch("/api/bucketupsert", {
				method: "POST",
				body: formData,
			});

			if (!bucketResponse.ok) {
				setIsLoading(false);
				setErrorMessage(`Error: ${error.message}`);
				clearVideo();
				console.error(error.message || error);
			}

			// 2. Get the public URL from Supabase storage
			const supabase = createClerkSupabaseClient(session);
			const {
				data: { publicUrl },
			} = supabase.storage.from("videos-bucket").getPublicUrl(fileUrl);

			formData.append("publicUrl", publicUrl);

			// 3. Transcribe video
			setStatus("Transcribing Video");
			const transcribeResponse = await fetch("/api/transcribe", {
				method: "POST",
				body: formData,
			});

      let summary = "";
			let embeddings = [];
			if (transcribeResponse.ok) {
				const data = await transcribeResponse.json();
        summary = data.summary;
				embeddings = data.embeddings;
				console.log("summary:", data.summary);
			} else {
				throw new Error(`Transcription failed! ${transcribeResponse.statusText}, ${transcribeResponse.status}`);
			}

			// Upsert video metadata to the supabase video table
			const tableResponse = await fetch("/api/tableupsert", {
				method: "POST",
				body: JSON.stringify({
					fileUrl,
					embeddings,
          summary,
					publicUrl,
				}),
			});

			if (!tableResponse.ok) {
				setErrorMessage(`Error: ${error.message}`);
				console.error(error.message || error);
			} else {
        setSuccessMessage("Video uploaded successfully!");
      }
		} catch (error) {
			setErrorMessage(`Error: ${error.message}`);
			console.error(error.message || error);
		} finally {
			clearVideo();
      setIsLoading(false);
    }
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-black to-indigo-950 overflow-hidden ">
			{fileUrl ? (
				<div className="flex flex-col items-center justify-center max-h-screen w-[350px] mt-24">
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
								<span className="text-white">{status}...</span>
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
				<div className="flex flex-col items-center justify-center w-full mt-24">
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
						<p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
					)}
					{successMessage && (
						<p className="text-green-500 text-sm font-semibold">
							{successMessage}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
