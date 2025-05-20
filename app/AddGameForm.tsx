"use client";
import { Player } from "./foosballTypes";
import { getPlayers as getPlayersDb, addGame as addGameDb } from "./foosballData";
import { useState, useEffect } from "react";

export default function AddGameForm({ onGameAdded }: { onGameAdded: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [red, setRed] = useState<string[]>([]);
  const [blue, setBlue] = useState<string[]>([]);
  const [scoreRed, setScoreRed] = useState("");
  const [scoreBlue, setScoreBlue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPlayersDb().then(setPlayers);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setLoading(true);
    try {
      await addGameDb(red, blue, sRed, sBlue);
      setRed([]);
      setBlue([]);
      setScoreRed("");
      setScoreBlue("");
      setError("");
      onGameAdded();
      setPlayers(await getPlayersDb());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  // Helper to render dropdowns for a team
  const renderDropdowns = (team: "red" | "blue") => {
    const teamArr = team === "red" ? red : blue;
    return [0, 1].map((idx) => (
      <div key={idx} className="relative mb-2">
        <select
          value={teamArr[idx] || ""}
          onChange={e => handleSelect(team, idx, e.target.value)}
          className={`border-2 border-persian_green-500 rounded-lg px-4 py-2 flex-1 bg-charcoal-400 text-saffron-900 focus:bg-charcoal-400 focus:text-saffron-900 placeholder:text-charcoal-700 focus:ring-2 focus:ring-persian_green-400 focus:border-persian_green-500 focus:outline-none text-lg font-semibold shadow-md transition-all duration-150 pr-10 hover:border-persian_green-400 cursor-pointer appearance-none w-full min-w-[120px]`}
          aria-label={`${team.charAt(0).toUpperCase() + team.slice(1)} Player ${idx + 1}`}
          style={{ backgroundColor: '#1f3943', color: '#faf3e1' }}
        >
          <option value="" className="text-charcoal-700 font-normal bg-charcoal-400">{team.charAt(0).toUpperCase() + team.slice(1)} Player {idx + 1}</option>
          {players
            .filter(p => (team === "red" ? !blue.includes(p.id) : !red.includes(p.id)))
            .map(p => (
              <option key={p.id} value={p.id} className="text-charcoal-900 font-semibold bg-charcoal-400">{p.name}</option>
            ))}
        </select>
        {/* Chevron icon for dropdown */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-persian_green-500 text-xl">
          ▼
        </span>
      </div>
    ));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-2xl animate-fadeInUp px-3 sm:px-0"
      style={{ boxShadow: '0 4px 24px 0 rgba(42,157,143,0.10)' }}
    >
      <div className="flex flex-col sm:flex-row gap-6 w-full items-stretch">
        <div className="flex flex-col gap-3 flex-1 min-w-[180px] bg-charcoal-400 rounded-2xl p-6 shadow-lg border border-charcoal-300 justify-center">
          <label className="block text-xs text-saffron-500 mb-2 font-semibold tracking-widest uppercase">Red Team</label>
          {renderDropdowns("red")}
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-[180px] bg-charcoal-400 rounded-2xl p-6 shadow-lg border border-charcoal-300 justify-center">
          <label className="block text-xs text-saffron-500 mb-2 font-semibold tracking-widest uppercase">Blue Team</label>
          {renderDropdowns("blue")}
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-[140px] bg-charcoal-400 rounded-2xl p-6 shadow-lg border border-charcoal-300 justify-center">
          <label className="block text-xs text-saffron-500 mb-2 font-semibold tracking-widest uppercase">Scores</label>
          <input
            type="number"
            value={scoreRed}
            onChange={e => setScoreRed(e.target.value)}
            className="border rounded px-3 py-2 w-full bg-charcoal-300 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500 focus:bg-charcoal-400 focus:text-saffron-900 text-lg font-semibold mb-1 transition"
            placeholder="Red Score"
            aria-label="Red Score"
          />
          <input
            type="number"
            value={scoreBlue}
            onChange={e => setScoreBlue(e.target.value)}
            className="border rounded px-3 py-2 w-full bg-charcoal-300 text-saffron-900 placeholder:text-charcoal-700 focus:ring-persian_green-500 focus:bg-charcoal-400 focus:text-saffron-900 text-lg font-semibold mb-2 transition"
            placeholder="Blue Score"
            aria-label="Blue Score"
          />
          <button
            type="submit"
            className="btn-primary rounded-lg px-4 py-2 font-semibold transition w-full mt-2 text-base shadow-sm hover:scale-[1.02] focus:ring-2 focus:ring-persian_green-400"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Game"}
          </button>
          {error && <span className="text-burnt_sienna-500 text-xs block mt-2">{error}</span>}
        </div>
      </div>
    </form>
  );
}
