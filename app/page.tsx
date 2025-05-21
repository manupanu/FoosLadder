"use client";

import AddPlayerForm from "./AddPlayerForm";
import AddGameForm from "./AddGameForm";
import Leaderboard from "./Leaderboard";
import LastGames from "./LastGames";
import { useState } from "react";
import PasswordGate from "./PasswordGate";
import Image from "next/image"; // Import the Image component

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh((r) => r + 1);
  const password = process.env.NEXT_PUBLIC_FOOSBALL_PASSWORD || "";

  return (
    <PasswordGate password={password}>
      <div className="flex flex-col items-center gap-10 py-12 px-4 animate-fadeIn w-full min-h-screen bg-gradient-to-br from-charcoal-800 via-charcoal-700 to-charcoal-800 text-charcoal-50">
        <header className="flex items-center gap-4 mb-4">
          <Image
            src="/foosball-logo.svg"
            alt="FoosLadder Logo"
            width={64} // Slightly larger logo
            height={64}
            className="drop-shadow-lg"
          />
          <h1 className="text-5xl font-bold text-saffron-400 drop-shadow-md tracking-tight text-center">
            Foosball Ladder 🏆
          </h1>
        </header>

        {/* Main content grid - adjusted for wider forms */}
        <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left column for forms - now wider */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-charcoal-700/60 rounded-xl p-6 shadow-xl border border-persian_green-500/30 backdrop-blur-sm">
              <AddPlayerForm onPlayerAdded={triggerRefresh} />
            </div>
            <div className="bg-charcoal-700/60 rounded-xl p-6 shadow-xl border border-persian_green-500/30 backdrop-blur-sm">
              <AddGameForm onGameAdded={triggerRefresh} />
            </div>
          </div>

          {/* Right column for leaderboard and last games - they will share this width */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Leaderboard key={`leaderboard-${refresh}`} />
            <LastGames refreshKey={refresh} />
          </div>
        </main>

        <footer className="mt-12 text-sm text-charcoal-300 text-center">
          Foosball Ladder &copy; {new Date().getFullYear()} - Built with ⚽ and 🔥
        </footer>
      </div>
    </PasswordGate>
  );
}
