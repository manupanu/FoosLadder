"use client";
import { useState } from "react";
import { Player } from "./foosballTypes";
import { getPlayers, addGame } from "./foosballData";

export default function AddGameForm({ onGameAdded }: { onGameAdded: () => void }) {
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [red, setRed] = useState<string[]>([]);
  const [blue, setBlue] = useState<string[]>([]);
  const [scoreRed, setScoreRed] = useState("");
  const [scoreBlue, setScoreBlue] = useState("");
  const [error, setError] = useState("");

  // Helper to handle dropdown selection for a team
  const handleSelect = (team: "red" | "blue", idx: number, value: string) => {
    if (team === "red") {
      const updated = [...red];
      updated[idx] = value;
      setRed(updated.filter(Boolean));
      // Remove from blue if selected
      setBlue(blue.filter((id) => id !== value));
    } else {
      const updated = [...blue];
      updated[idx] = value;
      setBlue(updated.filter(Boolean));
      setRed(red.filter((id) => id !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (red.length < 1 || blue.length < 1) {
      setError("Each team must have at least one player");
      return;
    }
    if (red.some(id => blue.includes(id))) {
      setError("A player cannot be on both teams");
      return;
    }
    const sRed = parseInt(scoreRed, 10);
    const sBlue = parseInt(scoreBlue, 10);
    if (isNaN(sRed) || isNaN(sBlue)) {
      setError("Scores must be numbers");
      return;
    }
    try {
      addGame(red, blue, sRed, sBlue);
      setRed([]);
      setBlue([]);
      setScoreRed("");
      setScoreBlue("");
      setError("");
      onGameAdded();
      setPlayers(getPlayers());
    } catch (err) {
      setError("Could not add game");
    }
  };

  // Helper to render dropdowns for a team
  const renderDropdowns = (team: "red" | "blue") => {
    const teamArr = team === "red" ? red : blue;
    return [0, 1].map((idx) => (
      <select
        key={idx}
        value={teamArr[idx] || ""}
        onChange={e => handleSelect(team, idx, e.target.value)}
        className={`border rounded px-2 py-1 flex-1 bg-charcoal-400 text-saffron-900 focus:ring-persian_green-500 mb-1`}
        aria-label={`${team.charAt(0).toUpperCase() + team.slice(1)} Player ${idx + 1}`}
      >
        <option value="">{team.charAt(0).toUpperCase() + team.slice(1)} Player {idx + 1}</option>
        {players
          .filter(p => (team === "red" ? !blue.includes(p.id) : !red.includes(p.id)))
          .map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
      </select>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md animate-fadeInUp">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-saffron-500 mb-1">Red Team</label>
          {renderDropdowns("red")}
        </div>
        <div className="flex-1">
          <label className="block text-xs text-saffron-500 mb-1">Blue Team</label>
          {renderDropdowns("blue")}
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={scoreRed}
          onChange={e => setScoreRed(e.target.value)}
          className="border rounded px-2 py-1 w-1/2 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500"
          placeholder="Red Score"
          aria-label="Red Score"
        />
        <input
          type="number"
          value={scoreBlue}
          onChange={e => setScoreBlue(e.target.value)}
          className="border rounded px-2 py-1 w-1/2 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500"
          placeholder="Blue Score"
          aria-label="Blue Score"
        />
      </div>
      <button
        type="submit"
        className="btn-primary rounded px-4 py-2 font-semibold transition"
      >
        Add Game
      </button>
      {error && <span className="text-burnt_sienna-500 text-xs">{error}</span>}
    </form>
  );
}
