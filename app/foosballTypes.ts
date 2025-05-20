// Player and Game types for the foosball app
export type Player = {
  id: string;
  name: string;
  elo: number;
};

export type Game = {
  id: string;
  date: string; // ISO string
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
};

// ELO calculation logic
export function calculateElo(
  playerElo: number,
  opponentElo: number,
  score: 0 | 1 // 1 = win, 0 = loss
): number {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(playerElo + K * (score - expected));
}
