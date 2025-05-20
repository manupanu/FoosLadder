import { Player, Game } from "./foosballTypes";

export type PlayerStats = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  eloHistory: { date: string; elo: number }[];
  redGames: number;
  blueGames: number;
  redWins: number;
  blueWins: number;
  redWinRate: number;
  blueWinRate: number;
};

// Calculate stats for a player
export function getPlayerStats(playerId: string, games: Game[], players: Player[]): PlayerStats {
  let gamesPlayed = 0;
  let wins = 0;
  let losses = 0;
  const eloHistory = [];
  const currentElo = 1000;
  let redGames = 0, blueGames = 0, redWins = 0, blueWins = 0;

  // Sort games by date ascending
  const sortedGames = [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const game of sortedGames) {
    // Defensive: skip games with missing red/blue arrays
    if (!game.red || !game.blue) continue;
    let involved = false;
    if (Array.isArray(game.red) && game.red.includes(playerId)) {
      involved = true;
      redGames++;
      if (game.redScore > game.blueScore) {
        wins++;
        redWins++;
      } else {
        losses++;
      }
    } else if (Array.isArray(game.blue) && game.blue.includes(playerId)) {
      involved = true;
      blueGames++;
      if (game.blueScore > game.redScore) {
        wins++;
        blueWins++;
      } else {
        losses++;
      }
    }
    if (involved) {
      gamesPlayed++;
      eloHistory.push({ date: game.date, elo: currentElo });
    }
  }
  return {
    gamesPlayed,
    wins,
    losses,
    winRate: gamesPlayed ? wins / gamesPlayed : 0,
    eloHistory,
    redGames,
    blueGames,
    redWins,
    blueWins,
    redWinRate: redGames ? redWins / redGames : 0,
    blueWinRate: blueGames ? blueWins / blueGames : 0,
  };
}
