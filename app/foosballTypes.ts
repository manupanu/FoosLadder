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

// Enhanced ELO calculation logic with team support
export function calculateElo(
  playerElo: number,
  teamAverageElo: number,
  opponentTeamAverageElo: number,
  score: 0 | 1, // 1 = win, 0 = loss
  teamSize: number = 1
): number {
  // K-factor adjustments based on team size and ELO difference
  const baseK = 32;
  const eloDifference = Math.abs(teamAverageElo - opponentTeamAverageElo);
  
  // Adjust K-factor: larger for bigger upsets, smaller for expected results
  let K = baseK;
  if (eloDifference > 200) {
    K = Math.min(40, baseK + (eloDifference - 200) / 50);
  }
  
  // Reduce K-factor for team games to prevent extreme swings
  if (teamSize > 1) {
    K *= 0.8;
  }
  
  // Calculate expected score using team averages
  const expected = 1 / (1 + Math.pow(10, (opponentTeamAverageElo - teamAverageElo) / 400));
  
  // Calculate individual adjustment with team consideration
  const teamFactor = teamSize === 1 ? 1 : 0.9; // Slightly reduce individual impact in team games
  const adjustment = K * teamFactor * (score - expected);
  
  return Math.round(Math.max(100, playerElo + adjustment)); // Minimum ELO of 100
}

// Utility function to calculate team average ELO
export function calculateTeamAverageElo(playerElos: number[]): number {
  if (playerElos.length === 0) return 1000; // Default ELO
  return playerElos.reduce((sum, elo) => sum + elo, 0) / playerElos.length;
}
