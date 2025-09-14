"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [matches, setMatches] = useState([]);

  // Function to fetch latest matches
  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/match");
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMatches();

    // Poll every 5 seconds
    const interval = setInterval(fetchMatches, 5000);

    // Listen for "matchSaved" event to fetch immediately after a match ends
    const handleMatchSaved = () => fetchMatches();
    window.addEventListener("matchSaved", handleMatchSaved);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("matchSaved", handleMatchSaved);
    };
  }, []);

  // Function to compute levels based on score
  const getLevel = (score) => {
    if (score >= 10) return "🌟 Expert";
    if (score >= 5) return "🔥 Pro";
    if (score >= 3) return "💪 Intermediate";
    return "👶 Beginner";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 rounded-2xl shadow-2xl bg-gradient-to-b from-pink-500 via-purple-600 to-purple-700 text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center animate-pulse drop-shadow-lg">
        🏆 Leaderboard
      </h2>

      {matches.length === 0 ? (
        <p className="text-center text-white/70 text-lg">No matches yet.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match, idx) => (
            <li
              key={match._id}
              className="p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              <div className="mb-2 sm:mb-0">
                <span className="font-semibold">Match {idx + 1}:</span>{" "}
                <span className="text-sm sm:text-base">{match.players.join(" vs ")}</span>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                {match.players.map((p) => (
                  <div key={p} className="flex justify-between w-full sm:w-48">
                    <span className="truncate">{p}</span>
                    <span className="font-semibold text-yellow-300 text-sm sm:text-base">
                      {match.scores?.[p] || 0} pts ({getLevel(match.scores?.[p] || 0)})
                    </span>
                  </div>
                ))}
                <span className="mt-2 font-bold text-base sm:text-lg text-green-400">
                  🏆 Winner: {match.winner}
                </span>
                <span className="text-xs sm:text-sm text-white/70 mt-1">
                  {new Date(match.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
