"use client";

import Image from "next/image";
import AddPlayerForm from "./AddPlayerForm";
import AddGameForm from "./AddGameForm";
import Leaderboard from "./Leaderboard";
import { useState } from "react";
import PasswordGate from "./PasswordGate";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh((r) => r + 1);

  return (
    <PasswordGate>
      <div className="flex flex-col items-center gap-8 py-10 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-2 text-saffron-500 drop-shadow">
          Foosball Ladder
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <div className="flex-1 flex flex-col gap-4">
            <AddPlayerForm onPlayerAdded={triggerRefresh} />
            <AddGameForm onGameAdded={triggerRefresh} />
          </div>
          <Leaderboard key={refresh} />
        </div>
        <footer className="mt-10 text-xs text-sandy_brown-700">
          Foosball App &copy; 2025 - Manuel Anrig
        </footer>
      </div>
    </PasswordGate>
  );
}
