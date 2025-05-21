"use client";
import { useState, useEffect } from "react";
import { addPlayer as addPlayerDb } from "./foosballData";

export default function AddPlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null); // Allow null for no error
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear messages after a delay
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 3000); // Clear messages after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    if (!name.trim()) {
      setError("Player name cannot be empty. 🤔");
      return;
    }
    setLoading(true);
    try {
      await addPlayerDb(name.trim());
      setSuccessMessage(`Player "${name.trim()}" added successfully! 🎉`);
      setName("");
      onPlayerAdded(); // Callback to refresh data in parent component
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to add player: ${errorMessage} 😥`);
      console.error("Error adding player:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fadeInUp">
      <h3 className="text-xl font-semibold text-saffron-400 mb-4 text-center">👤 Add New Player</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="sr-only">Player Name</label>
          <input
            id="playerName"
            type="text"
            className="w-full border-2 border-charcoal-500/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-persian_green-500 bg-charcoal-600 text-charcoal-50 placeholder-charcoal-400 transition-colors focus:border-persian_green-500/80 disabled:opacity-60"
            placeholder="Enter player name"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-label="Player name"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-charcoal-800 font-semibold rounded-lg px-6 py-3.5 text-base transition-all duration-150 ease-in-out shadow-md hover:shadow-saffron-500/40 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2 focus:ring-offset-charcoal-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 hover:scale-[1.01]"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-charcoal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Player...
            </>
          ) : "Add Player ➕"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md text-center border border-red-500/50">{error}</p>
        )}
        {successMessage && (
          <p role="status" className="text-sm text-green-400 bg-green-900/30 p-3 rounded-md text-center border border-green-500/50">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
