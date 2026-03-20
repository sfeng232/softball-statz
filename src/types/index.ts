export type Position = 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH' | 'UT';

export type AtBatResult = '1B' | '2B' | '3B' | 'HR' | 'BB' | 'HBP' | 'SAC' | 'SF' | 'K' | 'GO' | 'FO' | 'LO' | 'FC' | 'E' | 'DP' | 'INT';

export interface Player {
  id: string;
  jersey: number;
  name: string;
  position: Position;
}

export interface Game {
  id: string;
  date: string;
  opponent: string;
  isHome: boolean;
  summary?: string;
  mvp?: string;
}

export interface AtBat {
  id: string;
  gameId: string;
  playerId: string;
  result: AtBatResult;
  rbi: number;
  runScored: boolean;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  roster: Player[];
  games: Game[];
  atBats: AtBat[];
  activeGameId: string | null;
}

export interface AppState {
  teams: Team[];
  activeTeamId: string | null;
  anthropicApiKey: string | null;
}
