"use client";
import { useState, useEffect } from "react";
import { Game, Player } from "./foosballTypes";
import { getGames, getPlayers } from "./foosballData";

export default function LastGames({ refreshKey }: { refreshKey: number }) {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [fetchedGames, fetchedPlayers] = await Promise.all([
          getGames(),
          getPlayers(),
        ]);
        // Sort games by date, newest first
        const sortedGames = fetchedGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setGames(sortedGames);
        setPlayers(fetchedPlayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshKey]);

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  if (loading) {
    return <div className="text-center text-saffron-500/70 mt-4">Loading last games...</div>;
  }

  if (error) {
    return <div className="text-center text-burnt_sienna-500 mt-4">Error: {error}</div>;
  }

  if (games.length === 0) {
    return <div className="text-center text-saffron-500/70 mt-4">No games played yet.</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl shadow p-6 mt-8 animate-fadeInUp bg-card">
      <h2 className="text-2xl font-bold mb-6 text-center text-accent">
        Last Games
      </h2>
      <div className="space-y-4">
        {games.slice(0, 10).map((game) => (
          <div key={game.id} className="bg-charcoal-400/70 p-4 rounded-lg shadow border border-charcoal-300/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-saffron-500/60">
                {new Date(game.date).toLocaleDateString()} - {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <div className="text-left">
                <span className="font-semibold text-red-400 block">Red Team</span>
                {game.red.map(playerId => (
                  <span key={playerId} className="block text-sm text-saffron-900">{getPlayerName(playerId)}</span>
                ))}
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-saffron-500">
                  {game.redScore} - {game.blueScore}
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-blue-400 block">Blue Team</span>
                {game.blue.map(playerId => (
                  <span key={playerId} className="block text-sm text-saffron-900">{getPlayerName(playerId)}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
