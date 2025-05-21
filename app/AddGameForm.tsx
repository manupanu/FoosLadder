"use client";
import { Player } from "./foosballTypes";
import { getPlayers as getPlayersDb, addGame as addGameDb } from "./foosballData";
import { useState, useEffect } from "react";

export default function AddGameForm({ onGameAdded }: { onGameAdded: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [redTeam, setRedTeam] = useState<string[]>([]);
  const [blueTeam, setBlueTeam] = useState<string[]>([]);
  const [scoreRed, setScoreRed] = useState("");
  const [scoreBlue, setScoreBlue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayersDb();
        setPlayers(playersData);
      } catch (err) {
        setError("Failed to load players for the form. 😬");
        console.error("Error fetching players for form:", err);
      }
    };
    fetchPlayers();
  }, []);

  // Clear messages after a delay
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 4000); // Clear messages after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleSelect = (team: "red" | "blue", playerIndex: number, playerId: string) => {
    setError(null); // Clear error on interaction
    const otherTeam = team === "red" ? blueTeam : redTeam;
    const currentTeam = team === "red" ? redTeam : blueTeam;
    const setTeam = team === "red" ? setRedTeam : setBlueTeam;

    // If player is already on the other team, do nothing or show error (already handled by filter)
    if (otherTeam.includes(playerId) && playerId !== "") {
        setError("Player cannot be on both teams! 🙅");
        return;
    }

    const updatedTeam = [...currentTeam];
    // Ensure player is not already selected on the same team in a different slot
    if (playerId !== "" && updatedTeam.some((p, idx) => p === playerId && idx !== playerIndex)) {
        setError("Player already selected for this team. 🤔");
        return;
    }

    updatedTeam[playerIndex] = playerId;
    // Filter out empty strings if a player is deselected
    setTeam(updatedTeam.filter(p => p !== ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (redTeam.length === 0 || blueTeam.length === 0) {
      setError("Both teams need at least one player. 🧍‍♂️🧍‍♀️");
      return;
    }
    if (redTeam.some(id => blueTeam.includes(id))) {
      setError("A player cannot be on both teams! 🙅"); // Should be caught by handleSelect too
      return;
    }
    const sRed = parseInt(scoreRed, 10);
    const sBlue = parseInt(scoreBlue, 10);
    if (isNaN(sRed) || isNaN(sBlue) || sRed < 0 || sBlue < 0) {
      setError("Scores must be valid numbers (0 or more). 🔢");
      return;
    }
    if (sRed === sBlue) {
      setError("Games cannot end in a draw. One team must win! ⚔️");
      return;
    }

    setLoading(true);
    try {
      await addGameDb(redTeam, blueTeam, sRed, sBlue);
      setSuccessMessage("Game added successfully! 🚀");
      setRedTeam([]);
      setBlueTeam([]);
      setScoreRed("");
      setScoreBlue("");
      onGameAdded(); // Refresh leaderboard and last games
      // Optionally re-fetch players if their ELO might change immediately and affect dropdowns, though current ELO isn't shown here.
      // setPlayers(await getPlayersDb());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to add game: ${errorMessage} 💔`);
      console.error("Error adding game:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerDropdowns = (team: "red" | "blue") => {
    const currentTeam = team === "red" ? redTeam : blueTeam;
    const otherTeam = team === "red" ? blueTeam : redTeam;
    const teamColor = team === "red" ? "red" : "blue";
    // Define border colors based on team and selection state for a more dynamic feel
    const baseBorderColor = "border-charcoal-500/70";
    const selectedBorderColor = team === "red" ? "border-red-500/70" : "border-blue-500/70";
    const focusRingColor = team === "red" ? "focus:ring-red-500" : "focus:ring-blue-500";
    const focusBorderColor = team === "red" ? "focus:border-red-500" : "focus:border-blue-500";

    return [0, 1].map((idx) => {
      const isSelected = currentTeam[idx] && currentTeam[idx] !== "";
      const currentBorder = isSelected ? selectedBorderColor : baseBorderColor;

      return (
        <div key={`${team}-${idx}`} className="relative mb-3">
          <label htmlFor={`${team}-player-${idx + 1}`} className="sr-only">{`${teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Player ${idx + 1}`}</label>
          <select
            id={`${team}-player-${idx + 1}`}
            value={currentTeam[idx] || ""}
            onChange={e => handleSelect(team, idx, e.target.value)}
            className={`w-full border-2 ${currentBorder} rounded-lg px-4 py-3 bg-charcoal-600 text-charcoal-50 placeholder-charcoal-400 transition-all duration-150 ease-in-out ${focusRingColor} ${focusBorderColor} appearance-none disabled:opacity-60 shadow-sm hover:border-${teamColor}-400/80 focus:outline-none`}
            aria-label={`${teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Player ${idx + 1}`}
            disabled={loading}
          >
            <option value="" className="text-charcoal-300 bg-charcoal-700">-- Select Player {idx + 1} --</option>
            {players
              .filter(p => !otherTeam.includes(p.id) || p.id === currentTeam[idx])
              .filter(p => !currentTeam.includes(p.id) || p.id === currentTeam[idx])
              .map(p => (
                <option key={p.id} value={p.id} className="text-charcoal-50 bg-charcoal-700 hover:bg-charcoal-500">{p.name}</option> // ELO removed
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-300">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full mx-auto animate-fadeInUp">
      <h3 className="text-2xl font-semibold text-saffron-400 mb-6 text-center">🎯 Record New Game</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Red Team Section */}
          <div className={`bg-charcoal-600/50 p-5 rounded-lg shadow-lg border transition-colors duration-200 ${redTeam.length > 0 ? 'border-red-500/50' : 'border-charcoal-500/40'}`}>
            <h4 className="text-xl font-semibold text-red-400 mb-4 text-center">🔴 Red Team</h4>
            {renderPlayerDropdowns("red")}
            <div>
              <label htmlFor="scoreRed" className="sr-only">Red Team Score</label>
              <input
                id="scoreRed"
                type="number"
                min="0"
                value={scoreRed}
                onChange={e => setScoreRed(e.target.value)}
                className="w-full text-center px-4 py-3 bg-charcoal-600 border-2 border-red-500/50 rounded-lg text-2xl font-bold text-red-300 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/80 transition disabled:opacity-60 shadow-sm"
                placeholder="Score"
                aria-label="Red Team Score"
                disabled={loading}
              />
            </div>
          </div>

          {/* Blue Team Section */}
          <div className={`bg-charcoal-600/50 p-5 rounded-lg shadow-lg border transition-colors duration-200 ${blueTeam.length > 0 ? 'border-blue-500/50' : 'border-charcoal-500/40'}`}>
            <h4 className="text-xl font-semibold text-blue-400 mb-4 text-center">🔵 Blue Team</h4>
            {renderPlayerDropdowns("blue")}
            <div>
              <label htmlFor="scoreBlue" className="sr-only">Blue Team Score</label>
              <input
                id="scoreBlue"
                type="number"
                min="0"
                value={scoreBlue}
                onChange={e => setScoreBlue(e.target.value)}
                className="w-full text-center px-4 py-3 bg-charcoal-600 border-2 border-blue-500/50 rounded-lg text-2xl font-bold text-blue-300 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/80 transition disabled:opacity-60 shadow-sm"
                placeholder="Score"
                aria-label="Blue Team Score"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-persian_green-500 to-persian_green-600 hover:from-persian_green-600 hover:to-persian_green-700 text-white font-bold rounded-lg px-6 py-4 text-lg transition-all duration-150 ease-in-out shadow-md hover:shadow-persian_green-500/40 focus:outline-none focus:ring-2 focus:ring-persian_green-400 focus:ring-offset-2 focus:ring-offset-charcoal-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 hover:scale-[1.01]"
          disabled={loading || !players.length} // Also disable if players haven't loaded
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Game...
            </>
          ) : "Submit Game Result 🚀"} 
        </button>

        {error && (
          <p role="alert" className="text-sm text-red-300 bg-red-900/40 p-3 rounded-md text-center border border-red-500/60">{error}</p>
        )}
        {successMessage && (
          <p role="status" className="text-sm text-green-300 bg-green-900/40 p-3 rounded-md text-center border border-green-500/60">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
