"use client";
import { useState } from "react";
import { Player, Game } from "./foosballTypes";
import { getPlayers, getGames, addGame } from "./foosballData";

export default function AddGameForm({ onGameAdded }: { onGameAdded: () => void }) {
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [error, setError] = useState("");

  // Refresh players if needed
  const refreshPlayers = () => setPlayers(getPlayers());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1 || !player2 || player1 === player2) {
      setError("Select two different players");
      return;
    }
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);
    if (isNaN(s1) || isNaN(s2)) {
      setError("Scores must be numbers");
      return;
    }
    try {
      addGame(player1, player2, s1, s2);
      setPlayer1("");
      setPlayer2("");
      setScore1("");
      setScore2("");
      setError("");
      onGameAdded();
      refreshPlayers();
    } catch (err) {
      setError("Could not add game");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md animate-fadeInUp">
      <div className="flex gap-2">
        <select
          value={player1}
          onChange={e => setPlayer1(e.target.value)}
          className="border rounded px-2 py-1 flex-1 bg-charcoal-400 text-saffron-900 focus:ring-persian_green-500"
          aria-label="Player 1"
        >
          <option value="">Player 1</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          value={player2}
          onChange={e => setPlayer2(e.target.value)}
          className="border rounded px-2 py-1 flex-1 bg-charcoal-400 text-saffron-900 focus:ring-persian_green-500"
          aria-label="Player 2"
        >
          <option value="">Player 2</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={score1}
          onChange={e => setScore1(e.target.value)}
          className="border rounded px-2 py-1 w-1/2 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500"
          placeholder="Score 1"
          aria-label="Score 1"
        />
        <input
          type="number"
          value={score2}
          onChange={e => setScore2(e.target.value)}
          className="border rounded px-2 py-1 w-1/2 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500"
          placeholder="Score 2"
          aria-label="Score 2"
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
