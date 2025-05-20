"use client";
import { Player } from "./foosballTypes";
import { getPlayers as getPlayersDb } from "./foosballData";
import { useState, useEffect } from "react";
import PlayerStatsPanel from "./PlayerStatsPanel";

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    getPlayersDb().then(setPlayers);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl shadow p-6 animate-fadeInUp bg-card">
      <h2 className="text-2xl font-bold mb-4 text-center text-accent">
        Leaderboard
      </h2>
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-leaderboard-header">
            <th className="px-2 py-2 rounded-l-lg">#</th>
            <th className="px-2 py-2">Player</th>
            <th className="px-2 py-2 rounded-r-lg">ELO</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr
              key={p.id}
              className="bg-leaderboard-row hover:bg-persian_green-400 transition cursor-pointer"
              onClick={() => setSelectedPlayer(p.id)}
            >
              <td className="px-2 font-mono">{i + 1}</td>
              <td className="px-2">{p.name}</td>
              <td className="px-2 font-semibold">{p.elo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPlayer && (
        <PlayerStatsPanel
          playerId={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
