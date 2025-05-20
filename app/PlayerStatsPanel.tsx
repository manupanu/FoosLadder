"use client";
import { useEffect, useState } from "react";
import { Player, Game } from "./foosballTypes";
import { getPlayers, getGames } from "./foosballData";
import { getPlayerStats } from "./playerStats";
import PlayerEloChart from "./PlayerEloChart";

export default function PlayerStatsPanel({ playerId, onClose }: { playerId: string; onClose: () => void }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const players = getPlayers();
    const games = getGames();
    setPlayer(players.find(p => p.id === playerId) ?? null);
    setStats(getPlayerStats(playerId, games, players));
  }, [playerId]);

  if (!player || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-charcoal-400 rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeInUp">
        <button onClick={onClose} className="absolute top-2 right-2 text-saffron-500 text-xl font-bold">×</button>
        <h2 className="text-2xl font-bold text-saffron-500 mb-2 text-center">{player.name}</h2>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-persian_green-500 font-semibold">
            <span>ELO</span>
            <span>{player.elo}</span>
          </div>
          <div className="flex justify-between">
            <span>Games Played</span>
            <span>{stats.gamesPlayed}</span>
          </div>
          <div className="flex justify-between">
            <span>Wins</span>
            <span>{stats.wins}</span>
          </div>
          <div className="flex justify-between">
            <span>Losses</span>
            <span>{stats.losses}</span>
          </div>
          <div className="flex justify-between">
            <span>Win Rate</span>
            <span>{(stats.winRate * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Red Team Games</span>
            <span>{stats.redGames}</span>
          </div>
          <div className="flex justify-between">
            <span>Red Team Win Rate</span>
            <span>{(stats.redWinRate * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Blue Team Games</span>
            <span>{stats.blueGames}</span>
          </div>
          <div className="flex justify-between">
            <span>Blue Team Win Rate</span>
            <span>{(stats.blueWinRate * 100).toFixed(1)}%</span>
          </div>
        </div>
        <PlayerEloChart playerId={playerId} />
      </div>
    </div>
  );
}
