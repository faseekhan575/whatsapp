import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Appwrite from "../appwrite/Appwrite";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setError("");
    try {
      const Logins = await Appwrite.login({
        email: data.email,
        password: data.password,
      });
      if (Logins) {
        const userdata = await Appwrite.currentuser();
        if (userdata) {
          console.log("Login success");
          toast.success("Login Successful! Redirecting...");
          setTimeout(() => {
            navigate("/home");
          }, 3000);
          
        } else throw new Error("User fetch failed");
      }
    } catch (err) {
      toast.error("LOGIN FAILED PLZ LOGOUT FIRST!");
      
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      await Appwrite.logout();
      console.log("User logged out");
      toast.success("Logged out successfully! NOW LOGIN TO CONTINUE");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE — WhatsApp Green Theme Area */}
      <div className="md:w-1/2 w-full bg-[#075E54] flex flex-col items-center justify-center text-white p-6 md:p-10 relative">
        {/* Official WhatsApp Logo + Branding */}
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
            Welcome Back!
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6">
            Stay connected. Continue analysing your conversations smartly.
          </p>
          <div className="flex space-x-4 justify-center">
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">🌍</button>
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">💬</button>
            <button className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">📞</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Login Form */}
      <div className="md:w-1/2 w-full bg-[#0B141A] flex items-center justify-center p-6 md:p-10 relative">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-[#1C2733] p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5"
        >
          <div className="flex flex-col items-center mb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp Logo"
              className="w-16 h-16 mb-2"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Login to Account
            </h2>
            <p className="text-gray-400 text-sm md:text-base text-center">
              Enter your credentials to access WhatsApp Connect
            </p>
          </div>

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
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            className="p-3 rounded-lg bg-white/10 border border-gray-600 focus:border-[#25D366] outline-none text-white w-full text-sm md:text-base"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="p-3 rounded-full bg-[#25D366] hover:bg-[#20b358] transition-all text-white font-bold shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Login
          </button>

          {/* Logout Button Below Login */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all text-white font-bold shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Logout
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Signup Link */}
          <p className="text-gray-400 text-center text-sm md:text-base">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#25D366] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
