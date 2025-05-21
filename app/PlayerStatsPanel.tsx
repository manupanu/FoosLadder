"use client";
import { useEffect, useState } from "react";
import { Player } from "./foosballTypes";
import { getPlayers, getGames } from "./foosballData";
import { getPlayerStats } from "./playerStats";
import PlayerEloChart from "./PlayerEloChart";

export default function PlayerStatsPanel({ playerId, onClose }: { playerId: string; onClose: () => void }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof getPlayerStats> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const playersData = await getPlayers();
      const gamesData = await getGames();
      setPlayer(playersData.find(p => p.id === playerId) ?? null);
      setStats(getPlayerStats(playerId, gamesData));
    };
    fetchData();
  }, [playerId]);

  if (!player || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-charcoal-700 to-charcoal-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeInUp border border-persian_green-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-saffron-400 hover:text-saffron-300 text-3xl font-light transition-colors"
          aria-label="Close player stats"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-saffron-400 mb-6 text-center drop-shadow-md">{player.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-base">
          <div className="col-span-1 md:col-span-2 flex justify-between items-center py-3 border-b border-charcoal-500/50">
            <span className="text-persian_green-400 font-semibold text-lg">🏆 ELO Rating</span>
            <span className="text-2xl font-bold text-persian_green-300">{player.elo}</span>
          </div>

          <StatItem label="🎮 Games Played" value={stats.gamesPlayed} />
          <StatItem label="📈 Win Rate" value={`${(stats.winRate * 100).toFixed(1)}%`} />
          <StatItem label="✅ Wins" value={stats.wins} />
          <StatItem label="❌ Losses" value={stats.losses} />

          <div className="col-span-1 md:col-span-2 mt-4 mb-2">
            <h3 className="text-xl font-semibold text-saffron-400 border-b border-charcoal-500/50 pb-2">Team Stats</h3>
          </div>

          <StatItem label="🔴 Red Team Games" value={stats.redGames} />
          <StatItem label="📈 Red Win Rate" value={`${(stats.redWinRate * 100).toFixed(1)}%`} />
          <StatItem label="🔵 Blue Team Games" value={stats.blueGames} />
          <StatItem label="📈 Blue Win Rate" value={`${(stats.blueWinRate * 100).toFixed(1)}%`} />
        </div>

        <div className="mt-6 bg-charcoal-800/50 p-4 rounded-lg border border-charcoal-500/30">
          <h3 className="text-lg font-semibold text-saffron-400 mb-3 text-center">ELO History</h3>
          <PlayerEloChart playerId={playerId} />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-charcoal-100 text-sm">{label}</span>
      <span className="font-semibold text-lg text-saffron-300">{value}</span>
    </div>
  );
}
