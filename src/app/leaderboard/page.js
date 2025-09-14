"use client";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-500 via-purple-600 to-purple-700 p-4 sm:p-6 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
        🏆 Leaderboard
      </h1>

      <div className="w-full max-w-2xl">
        <Leaderboard />
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-8 w-full sm:w-auto bg-white text-purple-700 font-bold px-4 sm:px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all text-base sm:text-lg"
      >
        🏠 Go to Home
      </button>
    </main>
  );
}
