import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { Player, Game, calculateElo, calculateTeamAverageElo } from "./foosballTypes";

// Helper function to handle Supabase configuration errors
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not properly configured. Please check your environment variables.");
  }
};

export async function getPlayers(): Promise<Player[]> {
  checkSupabaseConfig();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("elo", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addPlayer(name: string): Promise<void> {
  checkSupabaseConfig();
  // Basic input validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error("Player name is required and must be a non-empty string.");
  }
  if (name.trim().length > 50) {
    throw new Error("Player name must be 50 characters or less.");
  }
  const { error } = await supabase.from("players").insert([{ name: name.trim() }]);
  if (error) throw error;
}

export async function getGames(): Promise<Game[]> {
  checkSupabaseConfig();
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
  checkSupabaseConfig();
  
  // Input validation
  if (!Array.isArray(red) || !Array.isArray(blue)) {
    throw new Error("Team arrays are required.");
  }
  if (red.length === 0 || blue.length === 0) {
    throw new Error("Each team must have at least one player.");
  }
  if (red.length > 2 || blue.length > 2) {
    throw new Error("Each team can have at most 2 players.");
  }
  if (typeof redScore !== 'number' || typeof blueScore !== 'number') {
    throw new Error("Scores must be numbers.");
  }
  if (redScore < 0 || blueScore < 0) {
    throw new Error("Scores cannot be negative.");
  }
  if (redScore > 999 || blueScore > 999) {
    throw new Error("Scores cannot exceed 999.");
  }
  if (redScore === blueScore) {
    throw new Error("Games cannot end in a tie.");
  }
  
  // Check for duplicate players across teams
  const allPlayers = [...red, ...blue];
  const uniquePlayers = new Set(allPlayers);
  if (allPlayers.length !== uniquePlayers.size) {
    throw new Error("A player cannot be on both teams or appear twice.");
  }
  // Fetch current players for ELO calculation
  const { data: players } = await supabase.from("players").select("*");
  if (!players) throw new Error("Could not fetch players");

  // Calculate average ELO for each team
  const redPlayers = red.map(id => players.find((p: Player) => p.id === id)).filter(Boolean) as Player[];
  const bluePlayers = blue.map(id => players.find((p: Player) => p.id === id)).filter(Boolean) as Player[];
  
  const redElos = redPlayers.map(p => p.elo);
  const blueElos = bluePlayers.map(p => p.elo);
  
  const redTeamAvgElo = calculateTeamAverageElo(redElos);
  const blueTeamAvgElo = calculateTeamAverageElo(blueElos);

  const redResult: 0 | 1 = redScore > blueScore ? 1 : 0;
  const blueResult: 0 | 1 = blueScore > redScore ? 1 : 0;

  // Calculate new ELOs using enhanced calculation
  const updates: { id: string; elo: number }[] = [];
  
  redPlayers.forEach((player) => {
    const newElo = calculateElo(
      player.elo, 
      redTeamAvgElo, 
      blueTeamAvgElo, 
      redResult, 
      red.length
    );
    updates.push({ id: player.id, elo: newElo });
  });
  
  bluePlayers.forEach((player) => {
    const newElo = calculateElo(
      player.elo, 
      blueTeamAvgElo, 
      redTeamAvgElo, 
      blueResult, 
      blue.length
    );
    updates.push({ id: player.id, elo: newElo });
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
