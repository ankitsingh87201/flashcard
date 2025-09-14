"use client";

export default function Scoreboard({ scores }) {
  // Sort players by score descending
  const sortedPlayers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

  return (
    <div className="mt-6 w-full max-w-md p-4 rounded-2xl shadow-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-pink-500 text-white mx-auto">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-center drop-shadow-md">
        🏆 Scoreboard
      </h2>
      <div className="flex flex-col gap-3">
        {sortedPlayers.map((playerId, index) => (
          <div
            key={playerId}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <span className="font-semibold truncate w-full sm:w-auto">
              {index + 1}. {playerId}
            </span>
            <span className="font-bold text-lg mt-1 sm:mt-0">{scores[playerId]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
