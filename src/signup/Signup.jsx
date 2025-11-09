import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Appwrite from "../appwrite/Appwrite";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    setError("");
    try {
      const signup = await Appwrite.register({
        fullname: data.name,
        email: data.email,
        password: data.password,
      });

      if (!signup) throw new Error("Signup failed");
      console.log("Signup success");

      const user = await Appwrite.login({
        email: data.email,
        password: data.password,
      });

      if (!user) throw new Error("Login failed");
      console.log("Login success", user);
      toast.success("Signup Successful!");
      setTimeout(() => {
        navigate("/RTC");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Signup Failed! plz try to logout first");
      navigate("/login");
      setError(err.message || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      await Appwrite.logout();
      console.log("User logged out");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE — WhatsApp Green Brand Area */}
      <div className="md:w-1/2 w-full bg-[#075E54] flex flex-col items-center justify-center text-white p-6 md:p-10 relative">
        {/* Official WhatsApp Logo */}
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            className="w-10 h-10"
          />
          <span className="font-bold text-xl">WhatsApp Connect</span>
        </div>

        <div className="text-center px-4 mt-10 md:mt-0">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Stay Connected, Instantly.
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6">
            Chat, collaborate, and analyze your communication with ease.
          </p>
          <div className="flex space-x-4 justify-center">
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">🌍</button>
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">💬</button>
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">📞</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Signup Form */}
      <div className="md:w-1/2 w-full bg-[#0B141A] flex items-center justify-center p-6 md:p-10 relative">
        {/* Logout Button */}
        {/* <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 font-semibold px-4 py-1.5 rounded-lg shadow-md text-sm md:text-base transition-all"
        >
          Logout
        </button> */}

        <form
          onSubmit={handleSubmit(handleSignup)}
          className="bg-[#1C2733] p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5"
        >
          <div className="flex flex-col items-center mb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp Logo"
              className="w-16 h-16 mb-2"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Join WhatsApp Connect today
            </p>
          </div>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="p-3 rounded-lg bg-white/10 border border-gray-600 focus:border-[#25D366] outline-none text-white w-full text-sm md:text-base"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                  "Invalid email address",
              },
            })}
            className="p-3 rounded-lg bg-white/10 border border-gray-600 focus:border-[#25D366] outline-none text-white w-full text-sm md:text-base"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="p-3 rounded-lg bg-white/10 border border-gray-600 focus:border-[#25D366] outline-none text-white w-full text-sm md:text-base"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="p-3 rounded-full bg-[#25D366] hover:bg-[#20b358] transition-all text-white font-bold shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Sign Up
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Already Have Account */}
          <p className="text-gray-400 text-center text-sm md:text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-[#25D366] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
