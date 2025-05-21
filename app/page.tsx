"use client";

import AddPlayerForm from "./AddPlayerForm";
import AddGameForm from "./AddGameForm";
import Leaderboard from "./Leaderboard";
import { useState } from "react";
import PasswordGate from "./PasswordGate";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh((r) => r + 1);
  // Read password from NEXT_PUBLIC_ env at build time (safe for hydration)
  const password = process.env.NEXT_PUBLIC_FOOSBALL_PASSWORD || "";

  return (
    <PasswordGate password={password}>
      <div className="flex flex-col items-center gap-8 py-10 animate-fadeIn w-full min-h-screen bg-charcoal-500">
        <h1 className="text-3xl font-bold mb-2 text-saffron-500 drop-shadow tracking-tight text-center">
          Foosball Ladder
        </h1>
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 px-4">
          <div className="w-full flex flex-col gap-4">
            <div className="bg-charcoal-400/50 rounded-2xl p-6 backdrop-blur shadow-lg border border-charcoal-300/20">
              <AddPlayerForm onPlayerAdded={triggerRefresh} />
              <AddGameForm onGameAdded={triggerRefresh} />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Leaderboard key={refresh} />
          </div>
        </div>
        <footer className="mt-10 text-xs text-sandy_brown-700 text-center">
          Foosball App &copy; 2025 - Manuel Anrig
        </footer>
      </div>
    </PasswordGate>
  );
}
