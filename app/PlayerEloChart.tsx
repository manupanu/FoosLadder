"use client";
import { useEffect, useState } from "react";
import { getGames } from "./foosballData";
import { getPlayerStats } from "./playerStats";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function PlayerEloChart({ playerId }: { playerId: string }) {
  const [eloHistory, setEloHistory] = useState<{ date: string; elo: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const games = await getGames();
      const stats = getPlayerStats(playerId, games);
      setEloHistory(stats.eloHistory);
    };
    fetchData();
  }, [playerId]);

  if (!eloHistory.length) return <div className="text-xs text-gray-400">No ELO history</div>;

  const data = {
    labels: eloHistory.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [
      {
        label: "ELO",
        data: eloHistory.map(e => e.elo),
        borderColor: "#2a9d8f",
        backgroundColor: "#2a9d8f33",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: true, title: { display: false } },
      y: { display: true, title: { display: false }, beginAtZero: false },
    },
  };

  return (
    <div className="w-full max-w-md bg-charcoal-400 rounded-xl p-4 mt-2">
      <Line data={data} options={options} height={200} />
    </div>
  );
}
