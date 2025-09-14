"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function GamePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth"); // agar login nahi hai to auth page pe bhej do
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-lg sm:text-xl font-mono text-pink-500">
        Loading...
      </p>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-pink-800 text-white gap-6 p-4">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-yellow-400 drop-shadow-lg text-center">
        🎮 Flashcard Frenzy
      </h1>
      <p className="text-base sm:text-lg text-center">
        Welcome, {user.email} 👋
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 w-full sm:w-auto">
        {/* 👤 Solo Play */}
        <button
          onClick={() => router.push("/game/play?mode=solo")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl text-base sm:text-xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          👤 Solo Play
        </button>

        {/* 👥 Multiplayer */}
        <button
          onClick={() => router.push("/game/play?mode=multi")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl text-base sm:text-xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          👥 Multiplayer
        </button>
      </div>
    </main>
  );
}
