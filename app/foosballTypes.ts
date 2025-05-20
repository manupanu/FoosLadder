// Player and Game types for the foosball app
export type Player = {
  id: string;
  name: string;
  elo: number;
};

export type Game = {
  id: string;
  date: string; // ISO string
  red: string[]; // 1 or 2 player IDs
  blue: string[]; // 1 or 2 player IDs
  redScore: number;
  blueScore: number;
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
