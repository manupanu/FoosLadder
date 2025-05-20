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
    <form onSubmit={handleSubmit} className="flex gap-2 items-center animate-fadeInUp">
      <input
        type="text"
        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-persian_green-500 bg-charcoal-400 text-saffron-900 placeholder:text-charcoal-700"
        placeholder="Add player name"
        value={name}
        onChange={e => setName(e.target.value)}
        aria-label="Player name"
        disabled={loading}
      />
      <button
        type="submit"
        className="btn-primary rounded px-3 py-1 font-semibold transition"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
      {error && <span className="text-burnt_sienna-500 text-xs ml-2">{error}</span>}
    </form>
  );
}
