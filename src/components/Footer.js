"use client";

import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Left side - copyright */}
       

        {/* Right side - social links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ankitsingh87201"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/ankitsingh87201/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>
         
          
        </div>
      </div>

      {/* Footer bottom text */}
      <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
        Created by <span className="text-yellow-300 font-semibold">Ankit Singh</span>
         <p className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Flashcard Frenzy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
