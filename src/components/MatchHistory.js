"use client";
import { useEffect, useState } from "react";

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/match")
      .then((res) => res.json())
      .then((data) => setMatches(data.matches || []))
      .catch((err) => console.error("Failed to fetch matches:", err));
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto mt-6 text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center drop-shadow-md">
        📜 Match History
      </h2>

      {matches.length === 0 ? (
        <p className="text-center text-white/70 text-lg">No matches played yet.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match, idx) => (
            <li
              key={match.id || idx}
              className="p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              <span className="font-semibold truncate w-full sm:w-1/3">
                {match.players.join(" vs ")}
              </span>

              <span className="mt-2 sm:mt-0 font-semibold text-yellow-300 w-full sm:w-1/4 text-center">
                🏆 {match.winner}
              </span>

              <span className="mt-2 sm:mt-0 w-full sm:w-1/4 text-center">
                Score: {match.score?.player1 || 0} - {match.score?.player2 || 0}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
