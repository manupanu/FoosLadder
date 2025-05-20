import { Player, Game, calculateElo } from "./foosballTypes";
import { v4 as uuidv4 } from "uuid";

// For demo: use localStorage for persistence
export function getPlayers(): Player[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("players");
  return data ? JSON.parse(data) : [];
}

export function savePlayers(players: Player[]) {
  localStorage.setItem("players", JSON.stringify(players));
}

export function getGames(): Game[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("games");
  return data ? JSON.parse(data) : [];
}

export function saveGames(games: Game[]) {
  localStorage.setItem("games", JSON.stringify(games));
}

// Add a new game and update ELOs
export function addGame(
  red: string[],
  blue: string[],
  redScore: number,
  blueScore: number
) {
  const players = getPlayers();
  const games = getGames();
  // Validate players
  if (red.length < 1 || blue.length < 1)
    throw new Error("Teams must have at least one player");
  if (red.some((id) => blue.includes(id)))
    throw new Error("A player cannot be on both teams");

  // Calculate average ELO for each team
  const redElo =
    red.reduce(
      (sum, id) => sum + (players.find((p) => p.id === id)?.elo ?? 1000),
      0
    ) / red.length;
  const blueElo =
    blue.reduce(
      (sum, id) => sum + (players.find((p) => p.id === id)?.elo ?? 1000),
      0
    ) / blue.length;

  // Determine winner/loser
  let redResult: 0 | 1 = redScore > blueScore ? 1 : 0;
  let blueResult: 0 | 1 = blueScore > redScore ? 1 : 0;

  // Update ELOs for each player
  red.forEach((id) => {
    const p = players.find((pl) => pl.id === id);
    if (p) p.elo = calculateElo(p.elo, blueElo, redResult);
  });
  blue.forEach((id) => {
    const p = players.find((pl) => pl.id === id);
    if (p) p.elo = calculateElo(p.elo, redElo, blueResult);
  });

  // Save new game
  games.push({
    id: uuidv4(),
    date: new Date().toISOString(),
    red,
    blue,
    redScore,
    blueScore,
  });
  saveGames(games);
  savePlayers(players);
}

// Add a new player
export function addPlayer(name: string) {
  const players = getPlayers();
  players.push({ id: uuidv4(), name, elo: 1000 });
  savePlayers(players);
}
