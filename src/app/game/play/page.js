"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Flashcard from "@/components/Flashcard";
import Scoreboard from "@/components/Scoreboard";
import Confetti from "react-confetti";
import { PlusCircle, KeyRound, Hourglass, PlayCircle, Copy } from "lucide-react";

const shuffleArray = (array) =>
  array
    .map((v) => ({ value: v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

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

  const [roomStage, setRoomStage] = useState("select"); // select / waiting / playing
  const [roomCode, setRoomCode] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [creator, setCreator] = useState(null); // room creator email

  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode") || "solo";

  const [roomSubscription, setRoomSubscription] = useState(null);

  // Initialize player and flashcards
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

      setFlashcards([
        { q: "Capital of France?", options: shuffleArray(["Paris", "London", "Berlin", "Madrid"]), a: "Paris" },
        { q: "Largest planet?", options: shuffleArray(["Earth", "Mars", "Jupiter", "Venus"]), a: "Jupiter" },
        { q: "ReactJS is used for?", options: shuffleArray(["Backend", "UI", "Database", "Networking"]), a: "UI" },
        { q: "Fastest land animal?", options: shuffleArray(["Cheetah", "Lion", "Tiger", "Leopard"]), a: "Cheetah" },
        { q: "H2O is?", options: shuffleArray(["Water", "Oxygen", "Hydrogen", "Helium"]), a: "Water" },
      ]);

      if (mode === "solo") setRoomStage("playing");
      else setRoomStage("select");

      setLoading(false);
    };
    init();
  }, [router, mode]);

  // Cleanup subscription
  useEffect(() => {
    return () => {
      if (roomSubscription) supabase.removeSubscription(roomSubscription);
    };
  }, [roomSubscription]);

  // Create Room
  const createRoom = async () => {
    if (!player) return;

    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const { data, error } = await supabase
      .from("rooms")
      .insert([{ code, players: [player], status: "waiting", creator: player }])
      .select()
      .single();

    if (error) return alert(error.message);

    setRoomCode(code);
    setRoomId(data.id);
    setCreator(player);
    setPlayers([player]);
    setScores({ [player]: 0 });
    setRoomStage("waiting");

    subscribeToRoom(data.id);
  };

  // Copy Room Code
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert(`Room Code "${roomCode}" copied!`);
  };

  // Join Room
  const joinRoom = async () => {
    if (!player) return;
    if (!roomCode) return alert("Enter room code!");

    const { data: roomData, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

    if (error || !roomData) return alert("Room not found!");

    // Add player if not already in room
    if (!roomData.players.includes(player)) {
      roomData.players.push(player);
      await supabase.from("rooms").update({ players: roomData.players }).eq("id", roomData.id);
    }

    setRoomId(roomData.id);
    setPlayers(roomData.players);
    setCreator(roomData.creator);
    setScores({ [player]: 0 });
    setRoomStage("waiting");

    subscribeToRoom(roomData.id);
  };

  // Subscribe to room updates (real-time)
  const subscribeToRoom = (id) => {
    const subscription = supabase
      .channel(`room_${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${id}` },
        (payload) => {
          const updatedRoom = payload.new;
          if (!updatedRoom) return;
          setPlayers(updatedRoom.players || []);
          setCreator(updatedRoom.creator);
          setRoomStage(updatedRoom.status === "playing" ? "playing" : "waiting");
        }
      )
      .subscribe();
    setRoomSubscription(subscription);
  };

  // Start Game (only creator)
  const startGame = async () => {
    if (!roomId) return;
    await supabase.from("rooms").update({ status: "playing" }).eq("id", roomId);
  };

  // Handle answering
  const handleOptionClick = (option) => {
    if (answered || gameEnded) return;
    setAnswered(true);
    setSelectedOption(option);

    const isCorrect = option === flashcards[questionIndex].a;
    if (isCorrect) setScores(prev => ({ ...prev, [player]: prev[player] + 1 }));

    setTimeout(() => {
      if (questionIndex + 1 === flashcards.length) {
        setGameEnded(true);
        setConfetti(true);
      } else {
        setQuestionIndex(prev => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
      }
    }, 800);
  };

  if (loading) return <p className="text-center mt-20">Loading game...</p>;

  // Multiplayer selection
  if (mode === "multi" && roomStage === "select") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-pink-800 p-6 gap-6 text-white">
        <h1 className="text-3xl font-bold">👥 Multiplayer</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={createRoom}
            className="flex items-center gap-2 bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
          >
            <PlusCircle /> Create Room
          </button>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="px-4 py-2 rounded-lg bg-amber-50 text-black w-full sm:w-auto"
            />
            <button
              onClick={joinRoom}
              className="flex items-center gap-2 bg-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all text-black"
            >
              <KeyRound /> Join Room
            </button>
          </div>
        </div>

        {roomCode && roomStage === "waiting" && (
          <div className="flex items-center gap-2 mt-4 bg-black bg-opacity-30 px-4 py-2 rounded-lg">
            <span className="font-mono">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-1 bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 transition-all"
            >
              <Copy size={16} /> Copy
            </button>
          </div>
        )}
      </main>
    );
  }

  // Waiting screen
  if (mode === "multi" && roomStage === "waiting") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-pink-800 gap-6 text-white">
        <Hourglass size={50} className="animate-pulse" />
        <h1 className="text-xl font-bold">Waiting for players...</h1>
        <p>Room Code: <span className="font-mono bg-black px-2 py-1 rounded">{roomCode}</span></p>
        <p>Players in room: {players.join(", ")}</p>

        {/* Start button only for creator and if more than 1 player */}
        {player === creator ? (
          players.length > 1 ? (
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all mt-2"
            >
              <PlayCircle /> Start Game
            </button>
          ) : (
            <p className="text-sm text-gray-200 mt-2">Waiting for another player to join...</p>
          )
        ) : (
          <p className="text-sm text-gray-200 mt-2">Waiting for the room creator to start the game...</p>
        )}
      </main>
    );
  }

  // Main game
  const options = flashcards[questionIndex].options;
  const correctAnswer = flashcards[questionIndex].a;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-pink-800 p-6 gap-6 text-white">
      {confetti && <Confetti recycle={false} numberOfPieces={200} />}
      <h1 className="text-2xl font-bold">{mode === "solo" ? "👤 Solo Play" : "👥 Multiplayer"}</h1>
      <p>Question {questionIndex + 1} / {flashcards.length}</p>
      <Flashcard question={flashcards[questionIndex].q} />

      <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-4">
        {options.map((opt) => {
          let bgClass = "bg-pink-500 hover:bg-pink-600";
          if (answered) {
            if (opt === correctAnswer) bgClass = "bg-green-500 text-white";
            else if (opt === selectedOption) bgClass = "bg-red-500 text-white";
          }
          return (
            <button key={opt} onClick={() => handleOptionClick(opt)} className={`px-4 py-2 rounded-lg font-semibold transition ${bgClass}`}>
              {opt}
            </button>
          );
        })}
      </div>
      <Scoreboard scores={scores} />
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <PlayPageContent />
    </Suspense>
  );
}
