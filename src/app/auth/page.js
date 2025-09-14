"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // default "login"
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/");
      else setLoading(false);
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/");
  };

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      if (data.session) router.push("/");
      else alert("Signup successful! Please check your email to verify.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg sm:text-xl font-mono text-pink-500">
        Checking session...
      </p>
    );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-600 via-purple-700 to-purple-900 text-white p-2 sm:p-4">
      <div className="w-full max-w-xs sm:max-w-md bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6">
        
        {/* Toggle Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setMode("login")}
            className={`px-3 sm:px-6 py-1 sm:py-2 rounded-lg font-bold flex items-center gap-1 sm:gap-2 text-sm sm:text-base transition ${
              mode === "login"
                ? "bg-green-500 text-white shadow-md sm:shadow-lg"
                : "bg-white/20 text-gray-200 hover:bg-white/30"
            }`}
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-3 sm:px-6 py-1 sm:py-2 rounded-lg font-bold flex items-center gap-1 sm:gap-2 text-sm sm:text-base transition ${
              mode === "signup"
                ? "bg-blue-500 text-white shadow-md sm:shadow-lg"
                : "bg-white/20 text-gray-200 hover:bg-white/30"
            }`}
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Signup
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-lg sm:text-xl md:text-3xl font-extrabold text-center text-yellow-300">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 rounded-lg text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 sm:right-3 flex items-center text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={mode === "login" ? handleLogin : handleSignup}
          className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base hover:scale-105 transition shadow-md sm:shadow-lg ${
            mode === "login" ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {mode === "login" ? <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> : <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />}
          {mode === "login" ? "Login" : "Signup"}
        </button>

        {/* Helper Text */}
        <p className="text-center text-xs sm:text-sm text-gray-200">
          {mode === "login" ? (
            <>
              New here?{" "}
              <span
                className="text-yellow-300 cursor-pointer underline"
                onClick={() => setMode("signup")}
              >
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-yellow-300 cursor-pointer underline"
                onClick={() => setMode("login")}
              >
                Login here
              </span>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
