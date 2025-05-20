-- Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  elo integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Games table
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  red_players uuid[] not null,
  blue_players uuid[] not null,
  red_score integer not null,
  blue_score integer not null,
  created_at timestamptz not null default now()
);

-- Game participants (future proof for stats, MVP not required)
create table if not exists game_participants (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team text check (team in ('red', 'blue')),
  elo_before integer,
  elo_after integer,
  created_at timestamptz not null default now()
);

-- Indexes for fast lookup
create index if not exists idx_players_name on players(name);
create index if not exists idx_games_date on games(date);
create index if not exists idx_game_participants_player_id on game_participants(player_id);
create index if not exists idx_game_participants_game_id on game_participants(game_id);
