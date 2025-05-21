import { supabase } from "./supabaseClient";
import { Player, Game, calculateElo } from "./foosballTypes";

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("elo", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addPlayer(name: string): Promise<void> {
  const { error } = await supabase.from("players").insert([{ name }]);
  if (error) throw error;
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("id, date, red_players, blue_players, red_score, blue_score") // Explicitly select columns
    .order("date", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  // Map database columns to Game type properties
  return data.map((game) => ({
    id: game.id,
    date: game.date,
    red: game.red_players || [], // Ensure 'red' is an array
    blue: game.blue_players || [], // Ensure 'blue' is an array
    redScore: game.red_score,
    blueScore: game.blue_score,
  }));
}

// Add a new game and update ELOs
export async function addGame(
  red: string[],
  blue: string[],
  redScore: number,
  blueScore: number
): Promise<void> {
  // Fetch current players for ELO calculation
  const { data: players } = await supabase.from("players").select("*");
  if (!players) throw new Error("Could not fetch players");

  // Calculate average ELO for each team
  const redElo =
    red.reduce(
      (sum, id) => sum + (players.find((p: Player) => p.id === id)?.elo ?? 1000),
      0
    ) / red.length;
  const blueElo =
    blue.reduce(
      (sum, id) => sum + (players.find((p: Player) => p.id === id)?.elo ?? 1000),
      0
    ) / blue.length;

  const redResult: 0 | 1 = redScore > blueScore ? 1 : 0;
  const blueResult: 0 | 1 = blueScore > redScore ? 1 : 0;

  // Calculate new ELOs
  const updates: { id: string; elo: number }[] = [];
  red.forEach((id) => {
    const p = players.find((pl: Player) => pl.id === id);
    if (p) updates.push({ id, elo: calculateElo(p.elo, blueElo, redResult) });
  });
  blue.forEach((id) => {
    const p = players.find((pl: Player) => pl.id === id);
    if (p) updates.push({ id, elo: calculateElo(p.elo, redElo, blueResult) });
  });

  // Insert game
  try {
    await supabase
      .from("games")
      .insert([
        {
          red_players: red,
          blue_players: blue,
          red_score: redScore,
          blue_score: blueScore,
        },
      ])
      .select()
      .single();
  } catch (error) {
    throw error;
  }

  // Update ELOs
  for (const update of updates) {
    await supabase.from("players").update({ elo: update.elo }).eq("id", update.id);
  }

  // Optionally: insert into game_participants for ELO history (future proof)
}
