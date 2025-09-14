"use client";

export default function Flashcard({ question, darkMode }) {
  return (
    <div
      className={`
        w-full sm:w-11/12 md:w-full max-w-md 
        p-4 sm:p-6 md:p-8 
        rounded-2xl shadow-2xl 
        text-center text-xl sm:text-2xl md:text-3xl font-bold 
        ${darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-purple-700"} 
        border-4 border-pink-500 
        animate-fadeIn
      `}
    >
      {question}
    </div>
  );
}
