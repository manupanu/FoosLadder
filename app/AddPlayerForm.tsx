"use client";
import { useState } from "react";
import { addPlayer } from "./foosballData";

export default function AddPlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Player name required");
      return;
    }
    try {
      addPlayer(name.trim());
      setName("");
      setError("");
      onPlayerAdded();
    } catch (err) {
      setError("Could not add player");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center animate-fadeInUp">
      <input
        type="text"
        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-persian_green-500 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700"
        placeholder="Add player name"
        value={name}
        onChange={e => setName(e.target.value)}
        aria-label="Player name"
      />
      <button
        type="submit"
        className="btn-primary rounded px-3 py-1 font-semibold transition"
      >
        Add
      </button>
      {error && <span className="text-burnt_sienna-500 text-xs ml-2">{error}</span>}
    </form>
  );
}
