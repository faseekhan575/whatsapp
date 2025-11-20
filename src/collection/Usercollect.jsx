import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Appwrite from "../appwrite/Appwrite";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { imageurl } from "../store/config";
import { name } from "../store/config";
import { userid } from "../store/config";

function UserCollect() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mydata, setMydata] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      try {
        const uploaded = await Appwrite.getfile(file);
        console.log("Uploaded file:", uploaded);

        const fileId = uploaded.$id;
        const bucketId = uploaded.bucketId;

        localStorage.setItem("lastFileId", fileId);

        const fileUrl = `${Appwrite.client.config.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${Appwrite.client.config.project}`;
        setMydata(fileUrl);

        dispatch(imageurl(uploaded.$id));
        console.log("Image URL dispatched:", fileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        dispatch(imageurl(null));
      }
    } else {
      setSelectedFile(null);
      setPreview(null);
      dispatch(imageurl(null));
    }
  };

  const handlecollect = async (data) => {
    setLoading(true); // ✅ Start loading
    try {
      if (!selectedFile) {
        throw new Error("Please upload a profile picture");
      }

      const uploaded = await Appwrite.getfile(selectedFile);
      console.log("Uploaded file:", uploaded);

      const currentUser = await Appwrite.currentuser();

      const user = await Appwrite.getuserdata({
        username: data.username,
        useris: currentUser.$id,
        imageurl: mydata,
      });

      dispatch(name(data.username));
      dispatch(userid(currentUser.$id));

      console.log("User data created:", data.username);
      console.log("Current user ID:", currentUser.$id);
      console.log("Image URL:letsssssssssss", mydata);

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // ✅ Stop loading when done
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(180deg, #128C7E 0%, #075E54 60%, #25D366 100%)",
      }}
    >
      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow px-6 py-12 text-white relative">
        {/* Left/Form Section */}
        <form
          onSubmit={handleSubmit(handlecollect)}
          className="flex-1 w-full max-w-lg space-y-6"
        >
          <h1 className="text-3xl font-bold mb-2">Set up your profile</h1>
          <p className="text-white/80 text-sm mb-8">
            Add your name and profile picture to personalize your WhatsApp
            experience.
          </p>

          {/* Image Upload */}
          <div className="flex flex-col items-start mb-6">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 rounded-full  object-cover border-4 border-white shadow-md mb-3"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center text-white mb-3">
                <span className="text-sm">No Image</span>
              </div>
            )}

            <label
              htmlFor="file"
              className="cursor-pointer text-white font-medium hover:underline"
            >
              Upload Profile Picture
            </label>
            <input
              id="file"
              type="file"
              {...register("file", { required: true })}
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.file && (
              <span className="text-red-300 text-xs mt-1">
                Profile picture required
              </span>
            )}
          </div>

          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: true })}
              className="w-full bg-white/20 border border-white/30 rounded-md p-3 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/70"
            />
            {errors.name && (
              <span className="text-red-300 text-xs">Name is required</span>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: true })}
              className="w-full bg-white/20 border border-white/30 rounded-md p-3 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/70"
            />
            {errors.username && (
              <span className="text-red-300 text-xs">
                Username is required
              </span>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-full shadow-lg transition-all duration-200 active:scale-95
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#25D366] hover:bg-[#1ebe5c]"}`}
          >
            {loading ? "Continuing..." : "Continue"}
          </button>
        </form>

        {/* WhatsApp Logo (Right Side) */}
        <div className="flex-1 flex justify-center mt-10 md:mt-0 md:justify-end">
          <div className="relative">
            <div className="bg-white/10 rounded-full p-8 md:p-12 shadow-2xl">
              <span className="text-white text-6xl md:text-8xl">💬</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Section */}
      <footer className="text-center text-white/80 text-xs py-4 bg-[#075E54]/30 backdrop-blur-sm">
        By continuing, you agree to our{" "}
        <span className="text-white font-semibold underline cursor-pointer">
          Privacy Policy
        </span>{" "}
        and{" "}
        <span className="text-white font-semibold underline cursor-pointer">
          Terms of Service
        </span>
        .
      </footer>
    </div>
  );
}

export default UserCollect;
