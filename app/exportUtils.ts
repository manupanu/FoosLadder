import { Game, Player } from "./foosballTypes";

export function exportGamesAsCSV(games: Game[], players: Player[]): void {
  const getPlayerName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  // Create CSV header
  const headers = [
    "Date",
    "Red Team",
    "Blue Team", 
    "Red Score",
    "Blue Score",
    "Winner"
  ];

  // Create CSV rows
  const rows = games.map(game => {
    const redTeamNames = game.red.map(getPlayerName).join(" & ");
    const blueTeamNames = game.blue.map(getPlayerName).join(" & ");
    const winner = game.redScore > game.blueScore ? "Red" : "Blue";
    const gameDate = new Date(game.date).toLocaleDateString();

    return [
      gameDate,
      redTeamNames,
      blueTeamNames,
      game.redScore.toString(),
      game.blueScore.toString(),
      winner
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `foosball-games-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportPlayersAsCSV(players: Player[]): void {
  // Create CSV header
  const headers = ["Player Name", "ELO Rating", "Rank"];

  // Sort players by ELO and create rows
  const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);
  const rows = sortedPlayers.map((player, index) => [
    player.name,
    player.elo.toString(),
    (index + 1).toString()
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `foosball-leaderboard-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}