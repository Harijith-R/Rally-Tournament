import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  FixturesPayload,
  Player,
  PlayersPayload,
  RallyDataset,
  ResultsPayload,
  RulesPayload,
  StandingsPayload,
  Team,
  TeamsPayload,
  TournamentData,
} from '../types/tournament';

interface TournamentContextValue {
  data: RallyDataset | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  getTeamById: (teamId: string) => Team | undefined;
  getPlayersByTeam: (teamId: string) => Player[];
  getPlayerById: (playerId: string) => Player | undefined;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

function resolveDataUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}data/tournaments/2026/${filename}`;
}

async function fetchJson<T>(filename: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(resolveDataUrl(filename), { signal });
  if (!response.ok) {
    throw new Error(`Unable to load ${filename} (HTTP ${response.status})`);
  }
  return (await response.json()) as T;
}

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RallyDataset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const reload = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [tournament, teamsPayload, playersPayload, fixtures, results, standings, rules] =
          await Promise.all([
            fetchJson<TournamentData>('tournament.json', controller.signal),
            fetchJson<TeamsPayload>('teams.json', controller.signal),
            fetchJson<PlayersPayload>('players.json', controller.signal),
            fetchJson<FixturesPayload>('fixtures.json', controller.signal),
            fetchJson<ResultsPayload>('results.json', controller.signal),
            fetchJson<StandingsPayload>('standings.json', controller.signal),
            fetchJson<RulesPayload>('rules.json', controller.signal),
          ]);

        if (!active) return;

        setData({
          tournament,
          teams: teamsPayload.teams,
          players: playersPayload.players,
          fixtures,
          results,
          standings,
          rules,
        });
      } catch (err) {
        if (!active || (err instanceof DOMException && err.name === 'AbortError')) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load tournament data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadAll();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadToken]);

  const teamMap = useMemo(() => {
    const map = new Map<string, Team>();
    data?.teams.forEach((team) => map.set(team.id, team));
    return map;
  }, [data]);

  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    data?.players.forEach((player) => map.set(player.id, player));
    return map;
  }, [data]);

  const playersByTeamMap = useMemo(() => {
    const map = new Map<string, Player[]>();
    data?.players.forEach((player) => {
      const existing = map.get(player.teamId) ?? [];
      existing.push(player);
      map.set(player.teamId, existing);
    });
    map.forEach((list) => list.sort((a, b) => a.order - b.order));
    return map;
  }, [data]);

  const getTeamById = useCallback((teamId: string) => teamMap.get(teamId), [teamMap]);

  const getPlayersByTeam = useCallback(
    (teamId: string) => playersByTeamMap.get(teamId) ?? [],
    [playersByTeamMap]
  );

  const getPlayerById = useCallback((playerId: string) => playerMap.get(playerId), [playerMap]);

  const value = useMemo<TournamentContextValue>(
    () => ({
      data,
      loading,
      error,
      reload,
      getTeamById,
      getPlayersByTeam,
      getPlayerById,
    }),
    [data, loading, error, reload, getTeamById, getPlayersByTeam, getPlayerById]
  );

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export function useTournament(): TournamentContextValue {
  const ctx = useContext(TournamentContext);
  if (!ctx) {
    throw new Error('useTournament must be used within TournamentProvider');
  }
  return ctx;
}
