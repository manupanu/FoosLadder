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
  player1Id: string,
  player2Id: string,
  player1Score: number,
  player2Score: number
) {
  const players = getPlayers();
  const games = getGames();
  const player1 = players.find((p) => p.id === player1Id);
  const player2 = players.find((p) => p.id === player2Id);
  if (!player1 || !player2) throw new Error("Player not found");

  // Determine winner/loser
  let p1Result: 0 | 1 = player1Score > player2Score ? 1 : 0;
  let p2Result: 0 | 1 = player2Score > player1Score ? 1 : 0;

  // Update ELOs
  player1.elo = calculateElo(player1.elo, player2.elo, p1Result);
  player2.elo = calculateElo(player2.elo, player1.elo, p2Result);

  // Save new game
  games.push({
    id: uuidv4(),
    date: new Date().toISOString(),
    player1Id,
    player2Id,
    player1Score,
    player2Score,
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
