"use client";
import { Player } from "./foosballTypes";
import { getPlayers as getPlayersDb } from "./foosballData";
import { useState, useEffect } from "react";
import PlayerStatsPanel from "./PlayerStatsPanel";

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const playersData = await getPlayersDb();
        setPlayers(playersData);
      } catch (error) {
        console.error("Failed to fetch players:", error);
        // Optionally, set an error state here to display to the user
      }
      setIsLoading(false);
    };
    fetchPlayers();
  }, []);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handleCloseStats = () => {
    setSelectedPlayer(null);
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-xl shadow-lg p-6 bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-persian_green-500/30">
        <h2 className="text-3xl font-bold mb-6 text-center text-saffron-400 drop-shadow-md">
          🏆 Leaderboard
        </h2>
        <div className="text-center text-charcoal-300 py-8">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl shadow-lg p-6 bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-persian_green-500/30 animate-fadeInUp">
      <h2 className="text-3xl font-bold mb-6 text-center text-saffron-400 drop-shadow-md">
        🏆 Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-charcoal-500/50">
              <th className="p-3 text-sm font-semibold text-persian_green-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="p-3 text-sm font-semibold text-persian_green-400 uppercase tracking-wider">
                Player
              </th>
              <th className="p-3 text-sm font-semibold text-persian_green-400 uppercase tracking-wider text-right">
                ELO
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr
                key={p.id}
                className="hover:bg-charcoal-600/50 transition-colors duration-150 cursor-pointer border-b border-charcoal-600/30 last:border-b-0"
                onClick={() => handlePlayerClick(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handlePlayerClick(p.id)}
                aria-label={`View stats for ${p.name}`}
              >
                <td className="p-3 font-mono text-lg text-saffron-300 text-center w-16">
                  {i + 1}
                </td>
                <td className="p-3 text-charcoal-50 text-base">{p.name}</td>
                <td className="p-3 font-semibold text-persian_green-300 text-lg text-right">
                  {p.elo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPlayer && (
        <PlayerStatsPanel
          playerId={selectedPlayer}
          onClose={handleCloseStats}
        />
      )}
    </div>
  );
}
