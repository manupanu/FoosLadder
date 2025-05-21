"use client";
import { useState, useEffect } from "react";
import { addPlayer as addPlayerDb, getPlayers as getPlayersDb } from "./foosballData";

export default function AddPlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPlayersDb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Player name required");
      return;
    }
    setLoading(true);
    try {
      await addPlayerDb(name.trim());
      setName("");
      setError("");
      onPlayerAdded();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center animate-fadeInUp w-full max-w-md mx-auto">
      <input
        type="text"
        className="flex-1 border-2 border-persian_green-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-persian_green-500 bg-charcoal-300 text-saffron-900 placeholder:text-charcoal-700 focus:bg-charcoal-400"
        placeholder="Add player name"
        value={name}
        onChange={e => setName(e.target.value)}
        aria-label="Player name"
        disabled={loading}
      />
      <button
        type="submit"
        className="btn-primary rounded-xl px-6 py-2 font-semibold transition hover:scale-[1.02] focus:ring-2 focus:ring-persian_green-400 disabled:opacity-50 disabled:hover:scale-100"
        disabled={loading}
      >
        {loading ? "..." : "Add"}
      </button>
      {error && <span className="text-burnt_sienna-500 text-xs absolute mt-2">{error}</span>}
    </form>
  );
}
