"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Flashcard from "@/components/Flashcard";
import Scoreboard from "@/components/Scoreboard";
import Leaderboard from "@/components/Leaderboard";
import Confetti from "react-confetti";

const shuffleArray = (array) =>
  array
    .map((v) => ({ value: v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

// Component that safely uses useSearchParams
function PlayPageContent() {
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [flashcards, setFlashcards] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      const email = data.session.user.email;
      setPlayer(email);
      setPlayers([email]);
      setScores({ [email]: 0 });

      // Setup flashcards
      setFlashcards([ { q: "Capital of France?", options: shuffleArray(["Paris", "London", "Berlin", "Madrid"]), a: "Paris" }, { q: "Largest planet?", options: shuffleArray(["Earth", "Mars", "Jupiter", "Venus"]), a: "Jupiter" }, { q: "ReactJS is used for?", options: shuffleArray(["Backend", "UI", "Database", "Networking"]), a: "UI" }, { q: "Fastest land animal?", options: shuffleArray(["Cheetah", "Lion", "Tiger", "Leopard"]), a: "Cheetah" }, { q: "H2O is?", options: shuffleArray(["Water", "Oxygen", "Hydrogen", "Helium"]), a: "Water" }, { q: "Light travels at?", options: shuffleArray(["3x10^8 m/s", "1x10^6 m/s", "5x10^7 m/s", "1x10^8 m/s"]), a: "3x10^8 m/s" }, { q: "Deepest ocean?", options: shuffleArray(["Pacific", "Atlantic", "Indian", "Arctic"]), a: "Pacific" }, { q: "Python is a?", options: shuffleArray(["Programming Language", "Snake", "Car", "Planet"]), a: "Programming Language" }, { q: "Square root of 64?", options: shuffleArray(["6", "7", "8", "9"]), a: "8" }, { q: "Author of 'Harry Potter'?", options: shuffleArray(["J.K. Rowling", "Tolkien", "Stephen King", "George Martin"]), a: "J.K. Rowling" }, { q: "Largest continent?", options: shuffleArray(["Asia", "Africa", "Europe", "Antarctica"]), a: "Asia" }, { q: "Chemical symbol for Gold?", options: shuffleArray(["Au", "Ag", "Gd", "Go"]), a: "Au" }, { q: "First man on the moon?", options: shuffleArray(["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"]), a: "Neil Armstrong" }, { q: "Fastest bird?", options: shuffleArray(["Peregrine Falcon", "Eagle", "Sparrow", "Ostrich"]), a: "Peregrine Falcon" }, { q: "Largest mammal?", options: shuffleArray(["Blue Whale", "Elephant", "Giraffe", "Hippopotamus"]), a: "Blue Whale" }, { q: "Currency of Japan?", options: shuffleArray(["Yen", "Dollar", "Euro", "Won"]), a: "Yen" }, { q: "Primary colors?", options: shuffleArray(["Red, Blue, Yellow", "Green, Purple, Orange", "Black, White, Gray", "Pink, Cyan, Magenta"]), a: "Red, Blue, Yellow" }, { q: "Pythagoras theorem applies to?", options: shuffleArray(["Right Triangle", "Circle", "Square", "Rectangle"]), a: "Right Triangle" }, { q: "Speed of sound approx?", options: shuffleArray(["343 m/s", "300 m/s", "150 m/s", "500 m/s"]), a: "343 m/s" }, { q: "Smallest prime number?", options: shuffleArray(["2", "1", "3", "0"]), a: "2" }, ]);
      setLoading(false);
    };
    init();
  }, [router, mode]);

  const handleOptionClick = (option) => {
    if (answered || gameEnded) return;
    setAnswered(true);
    setSelectedOption(option);

    const isCorrect = option === flashcards[questionIndex].a;
    if (isCorrect) setScores((prev) => ({ ...prev, [player]: prev[player] + 1 }));

    setTimeout(() => {
      if (questionIndex + 1 === flashcards.length) {
        setGameEnded(true);
        setConfetti(true);
        saveMatch();
      } else {
        setQuestionIndex((prev) => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
      }
    }, 800);
  };

  const saveMatch = async () => {
    try {
      const payload = {
        players,
        scores,
        winner: player,
        createdAt: new Date().toISOString(),
      };
      await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.dispatchEvent(new Event("matchSaved"));
    } catch (err) {
      console.error("Failed to save match", err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading game...</p>;

  const renderOptions = () => {
    const options = flashcards[questionIndex].options;
    const correctAnswer = flashcards[questionIndex].a;

    return (
      <div className="flex flex-col sm:flex-row w-full max-w-md mt-3 gap-3">
        {[0, 2].map((start) => (
          <div key={start} className="flex flex-col gap-3 flex-1">
            {options.slice(start, start + 2).map((opt) => {
              const isSelected = opt === selectedOption;
              const isCorrect = opt === correctAnswer;
              let bgClass = "bg-pink-500 hover:bg-pink-600";

              if (answered) {
                if (isSelected && isCorrect) bgClass = "bg-green-500 text-white";
                else if (isSelected && !isCorrect) bgClass = "bg-red-500 text-white";
                else if (!isSelected && isCorrect) bgClass = "bg-green-500 text-white/80";
                else bgClass = "bg-pink-500/50";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${bgClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-pink-800 p-3 sm:p-6 mt-7 text-white gap-4 sm:gap-6">
      {confetti && <Confetti recycle={false} numberOfPieces={200} />}
      <h1 className="text-xl sm:text-3xl font-bold text-yellow-400 text-center">
        {mode === "solo" ? "👤 Solo Play" : "👥 Multiplayer"}
      </h1>

      {!gameEnded ? (
        <>
          <p className="text-xs sm:text-base text-center">
            Question {questionIndex + 1} / {flashcards.length}
          </p>
          <Flashcard question={flashcards[questionIndex].q} />
          {renderOptions()}
          <Scoreboard scores={scores} />
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-bold">🎉 Game Over!</h2>
          <p className="text-xs sm:text-base">
            Your Score: {scores[player]} / {flashcards.length}
          </p>

          <button
            onClick={() => {
              const leaderboardEl = document.getElementById("leaderboard");
              leaderboardEl?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-green-500 px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg mt-3 sm:mt-4"
          >
            Save & Show Leaderboard
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-yellow-400 px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg mt-3 sm:mt-4 ml-2 text-black"
          >
            Start Again
          </button>

          <div id="leaderboard" className="mt-4">
            <Leaderboard />
          </div>
        </div>
      )}
    </main>
  );
}

// 👇 Wrap PlayPageContent inside Suspense
export default function PlayPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <PlayPageContent />
    </Suspense>
  );
}
