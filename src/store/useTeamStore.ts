import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Team, Player, Game, AtBat, AppState, AtBatResult } from '../types';

interface State extends AppState {
  setApiKey: (key: string) => void;
  createTeam: (name: string) => void;
  deleteTeam: (id: string) => void;
  switchTeam: (id: string) => void;
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => void;
  removePlayer: (teamId: string, playerId: string) => void;
  createGame: (teamId: string, game: Omit<Game, 'id'>) => void;
  deleteGame: (teamId: string, gameId: string) => void;
  setActiveGame: (teamId: string, gameId: string | null) => void;
  logAtBat: (teamId: string, atBat: Omit<AtBat, 'id' | 'timestamp'>) => void;
  undoLastAtBat: (teamId: string, gameId: string) => void;
  updateGameSummary: (teamId: string, gameId: string, summary: string, mvp: string) => void;
}

export const useTeamStore = create<State>()(
  persist(
    (set) => ({
      teams: [],
      activeTeamId: null,
      anthropicApiKey: null,

      setApiKey: (key) => set({ anthropicApiKey: key }),

      createTeam: (name) => set((state) => {
        const newTeam: Team = {
          id: crypto.randomUUID(),
          name,
          roster: [],
          games: [],
          atBats: [],
          activeGameId: null
        };
        const activeTeamId = state.activeTeamId ? state.activeTeamId : newTeam.id;
        return { teams: [...state.teams, newTeam], activeTeamId };
      }),

      deleteTeam: (id) => set((state) => {
        const teams = state.teams.filter(t => t.id !== id);
        return {
          teams,
          activeTeamId: state.activeTeamId === id ? (teams[0]?.id || null) : state.activeTeamId
        };
      }),

      switchTeam: (id) => set({ activeTeamId: id }),

      addPlayer: (teamId, player) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, roster: [...t.roster, { ...player, id: crypto.randomUUID() }]
        } : t)
      })),

      removePlayer: (teamId, playerId) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, roster: t.roster.filter(p => p.id !== playerId)
        } : t)
      })),

      createGame: (teamId, game) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, games: [...t.games, { ...game, id: crypto.randomUUID() }]
        } : t)
      })),

      deleteGame: (teamId, gameId) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, 
          games: t.games.filter(g => g.id !== gameId),
          atBats: t.atBats.filter(ab => ab.gameId !== gameId),
          activeGameId: t.activeGameId === gameId ? null : t.activeGameId
        } : t)
      })),

      setActiveGame: (teamId, gameId) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? { ...t, activeGameId: gameId } : t)
      })),

      logAtBat: (teamId, atBat) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, 
          atBats: [...t.atBats, { ...atBat, id: crypto.randomUUID(), timestamp: Date.now() }]
        } : t)
      })),

      undoLastAtBat: (teamId, gameId) => set((state) => ({
        teams: state.teams.map(t => {
          if (t.id !== teamId) return t;
          const gameAtBats = t.atBats.filter(a => a.gameId === gameId);
          if (gameAtBats.length === 0) return t;
          const lastAtBat = gameAtBats.sort((a,b) => b.timestamp - a.timestamp)[0];
          return {
            ...t,
            atBats: t.atBats.filter(ab => ab.id !== lastAtBat.id)
          };
        })
      })),

      updateGameSummary: (teamId, gameId, summary, mvp) => set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? {
          ...t, games: t.games.map(g => g.id === gameId ? { ...g, summary, mvp } : g)
        } : t)
      })),
    }),
    {
      name: 'diamond-stats-storage',
    }
  )
);
