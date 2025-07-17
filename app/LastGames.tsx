"use client";
import { useState, useEffect } from "react";
import { Game, Player } from "./foosballTypes";
import { getGames, getPlayers } from "./foosballData";
import { exportGamesAsCSV } from "./exportUtils";

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
        const sortedGames = fetchedGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setGames(sortedGames);
        setPlayers(fetchedPlayers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load games";
        setError(errorMessage);
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshKey]);

  const getPlayerName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const handleExportGames = () => {
    try {
      exportGamesAsCSV(games, players);
    } catch (err) {
      console.error("Failed to export games:", err);
      alert("Failed to export games. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-xl shadow-lg p-6 mt-8 bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-persian_green-500/30">
        <h2 className="text-3xl font-bold mb-6 text-center text-saffron-400 drop-shadow-md">
          RECENT GAMES 📜
        </h2>
        <div className="text-center text-charcoal-300 py-8">Loading recent games... ⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl shadow-lg p-6 mt-8 bg-red-800/20 border border-red-500/50">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-300 drop-shadow-md">
          Error 😥
        </h2>
        <div className="text-center text-red-200 py-8">Could not load game data: {error}</div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="w-full rounded-xl shadow-lg p-6 mt-8 bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-persian_green-500/30">
        <h2 className="text-3xl font-bold mb-6 text-center text-saffron-400 drop-shadow-md">
          RECENT GAMES 📜
        </h2>
        <div className="text-center text-charcoal-300 py-8">No games recorded yet. Be the first! ✨</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl shadow-lg p-6 mt-8 bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-persian_green-500/30 animate-fadeInUp">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-saffron-400 drop-shadow-md">
          RECENT GAMES 📜
        </h2>
        {games.length > 0 && (
          <button
            onClick={handleExportGames}
            className="bg-saffron-600 hover:bg-saffron-700 text-charcoal-800 font-medium px-4 py-2 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
            title="Export all games as CSV"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        )}
      </div>
      <div className="space-y-4">
        {games.slice(0, 10).map((game) => {
          const gameDate = new Date(game.date);
          const isRedWinner = game.redScore > game.blueScore;
          return (
            <div key={game.id} className="bg-charcoal-600/40 p-4 rounded-lg shadow-md border border-charcoal-500/40 transition-all hover:shadow-persian_green-500/20 hover:border-persian_green-500/60">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-charcoal-500/50">
                <span className="text-xs text-charcoal-300 font-mono">
                  {gameDate.toLocaleDateString()} - {gameDate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isRedWinner ? 'bg-red-500/30 text-red-300' : 'bg-blue-500/30 text-blue-300'}`}>
                  {isRedWinner ? 'Red Wins' : 'Blue Wins'}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                {/* Red Team */}
                <div className={`text-left ${isRedWinner ? 'font-semibold' : ''}`}>
                  <span className={`block text-sm mb-1 ${isRedWinner ? 'text-red-400' : 'text-red-500'}`}>🔴 Red Team</span>
                  {game.red.map(playerId => (
                    <span key={playerId} className={`block text-xs ${isRedWinner ? 'text-charcoal-100' : 'text-charcoal-300'}`}>{getPlayerName(playerId)}</span>
                  ))}
                </div>

                {/* Score */}
                <div className="text-center">
                  <span className={`text-3xl font-bold ${isRedWinner ? 'text-red-400' : 'text-blue-400'}`}>
                    {game.redScore}
                  </span>
                  <span className="text-xl text-charcoal-300"> - </span>
                  <span className={`text-3xl font-bold ${!isRedWinner ? 'text-blue-400' : 'text-red-400'}`}>
                    {game.blueScore}
                  </span>
                </div>

                {/* Blue Team */}
                <div className={`text-right ${!isRedWinner ? 'font-semibold' : ''}`}>
                  <span className={`block text-sm mb-1 ${!isRedWinner ? 'text-blue-400' : 'text-blue-500'}`}>🔵 Blue Team</span>
                  {game.blue.map(playerId => (
                    <span key={playerId} className={`block text-xs ${!isRedWinner ? 'text-charcoal-100' : 'text-charcoal-300'}`}>{getPlayerName(playerId)}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
