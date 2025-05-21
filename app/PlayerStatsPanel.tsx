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
      const players = await getPlayers();
      const games = await getGames();
      setPlayer(players.find(p => p.id === playerId) ?? null);
      setStats(getPlayerStats(playerId, games));
    };
    fetchData();
  }, [playerId]);

  if (!player || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeInUp border border-persian_green-500/20">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-saffron-400 hover:text-saffron-300 text-2xl font-bold transition-colors"
          aria-label="Close player stats"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-saffron-400 mb-6 text-center">{player.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6 text-lg">
          <div className="col-span-1 md:col-span-2 flex justify-between items-center py-2 border-b border-charcoal-400">
            <span className="text-persian_green-400 font-semibold">ELO Rating</span>
            <span className="text-xl font-bold text-persian_green-300">{player.elo}</span>
          </div>

          <StatItem label="Games Played" value={stats.gamesPlayed} />
          <StatItem label="Win Rate" value={`${(stats.winRate * 100).toFixed(1)}%`} />
          <StatItem label="Wins" value={stats.wins} />
          <StatItem label="Losses" value={stats.losses} />

          <div className="col-span-1 md:col-span-2 mt-3 mb-1">
            <h3 className="text-xl font-semibold text-saffron-400 border-b border-charcoal-400 pb-1">Team Statistics</h3>
          </div>

          <StatItem label="Red Team Games" value={stats.redGames} />
          <StatItem label="Red Team Win Rate" value={`${(stats.redWinRate * 100).toFixed(1)}%`} />
          <StatItem label="Blue Team Games" value={stats.blueGames} />
          <StatItem label="Blue Team Win Rate" value={`${(stats.blueWinRate * 100).toFixed(1)}%`} />
        </div>

        <div className="mt-4">
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
    <div className="flex justify-between py-2">
      <span className="text-charcoal-50">{label}</span>
      <span className="font-medium text-saffron-300">{value}</span>
    </div>
  );
}
