"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-xl font-mono text-pink-500">
        Loading...
      </p>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-700 via-pink-700 to-pink-500 text-white">
      <h1 className="text-2xl sm:tsxt-sm  font-extrabold mb-6">🎓 Flashcard Frenzy</h1>
      <p className="text-lg mb-10">
        {user ? `Welcome, ${user.email}!` : "Login to get started."}
      </p>

      {user ? (
        <button
          onClick={() => router.push("/game")}
          className="px-5 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl text-2xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          🚀 Get Started
        </button>
      ) : (
        <button
          onClick={() => router.push("/auth")}
          className="px-8 py-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl text-2xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          🔑 Login
        </button>
      )}
      
    </main>
    
  );
}
