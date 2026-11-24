import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { GroupId } from '../types/tournament';

export const PlayersPage: React.FC = () => {
  const { data, getTeamById } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'ALL' | GroupId>('ALL');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('ALL');

  useDocumentMeta(
    'Players Directory | RALLY 2026',
    'Complete searchable directory of all 68 verified players competing in RALLY TOURNAMENT 2026.'
  );

  const filteredPlayers = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.players.filter((player) => {
      if (selectedGroup !== 'ALL' && player.group !== selectedGroup) return false;
      if (selectedTeamId !== 'ALL' && player.teamId !== selectedTeamId) return false;
      if (q && !player.name.toLowerCase().includes(q) && !player.teamName.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [data, searchQuery, selectedGroup, selectedTeamId]);

  const availableTeamsForSelect = useMemo(() => {
    if (!data) return [];
    if (selectedGroup === 'ALL') return data.teams;
    return data.teams.filter((t) => t.group === selectedGroup);
  }, [data, selectedGroup]);

  if (!data) return null;

  const hasFilters =
    searchQuery.trim().length > 0 || selectedGroup !== 'ALL' || selectedTeamId !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGroup('ALL');
    setSelectedTeamId('ALL');
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-10 mb-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
            Official Athlete Registry
          </p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
            PLAYERS DIRECTORY
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
            All sixty-eight official RALLY 2026 athletes. Each player maintains a unique registry
            record linked to their exact team and group assignment.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border border-white/10 bg-[#17212B] p-5 mb-8">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <label htmlFor="player-search" className="sr-only">
              Search players by name
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AAB3BD]"
              aria-hidden="true"
            />
            <input
              id="player-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player name (e.g. Manoj, Vishnu, Vinod)…"
              className="w-full h-11 border border-white/15 bg-[#101820] pl-11 pr-10 text-sm text-white placeholder-[#7C8894] focus:border-[#A3E635] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAB3BD] hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Group Segmented Filter */}
          <div className="lg:col-span-3 flex items-center border border-white/15 bg-[#101820] p-1">
            {(['ALL', 'A', 'B'] as const).map((group) => {
              const active = selectedGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(group);
                    if (group !== 'ALL' && selectedTeamId !== 'ALL') {
                      const t = getTeamById(selectedTeamId);
                      if (t && t.group !== group) setSelectedTeamId('ALL');
                    }
                  }}
                  className={`flex-1 h-9 text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                    active ? 'bg-[#A3E635] text-[#101820]' : 'text-[#AAB3BD] hover:text-white'
                  }`}
                >
                  {group === 'ALL' ? 'All Groups' : `Group ${group}`}
                </button>
              );
            })}
          </div>

          {/* Team Dropdown Filter */}
          <div className="lg:col-span-3">
            <label htmlFor="team-filter" className="sr-only">
              Filter by team
            </label>
            <select
              id="team-filter"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full h-11 border border-white/15 bg-[#101820] px-4 text-sm text-white focus:border-[#A3E635] focus:outline-none"
            >
              <option value="ALL">All Teams (6)</option>
              {availableTeamsForSelect.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} — Group {team.group} ({team.playerCount})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-1 flex items-center">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              className="w-full h-11 border border-white/15 bg-[#101820] px-3 text-xs font-medium tracking-wider text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Meta Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-[#AAB3BD] tabular-nums">
          <span>
            Showing <strong className="text-white">{filteredPlayers.length}</strong> of{' '}
            <strong className="text-white">{data.players.length}</strong> registered players
          </span>
          <span>Group A: 34 · Group B: 34</span>
        </div>

        {/* Player Cards Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="border border-white/10 bg-[#17212B] p-12 text-center">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white uppercase">
              No Matching Players
            </h2>
            <p className="mt-2 text-sm text-[#AAB3BD]">
              No registered athletes matched &ldquo;{searchQuery}&rdquo; with the active team/group
              filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 bg-[#A3E635] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#101820] uppercase"
            >
              Show All 68 Players
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map((player) => {
              const team = getTeamById(player.teamId);
              const teamColor = team?.color ?? '#A3E635';

              return (
                <Link
                  key={player.id}
                  to={`/teams/${player.teamId}`}
                  className="group flex items-center gap-4 border border-white/10 bg-[#17212B] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 bg-[#101820] font-display text-lg font-bold tracking-wider text-white"
                    style={{ boxShadow: `inset 0 -2px 0 0 ${teamColor}` }}
                  >
                    {player.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-semibold tracking-wide text-white truncate group-hover:text-[#A3E635] transition-colors">
                      {player.name}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#AAB3BD] tabular-nums">
                      <span
                        className="inline-block h-2 w-2 shrink-0"
                        style={{ backgroundColor: teamColor }}
                        aria-hidden="true"
                      />
                      <span className="text-[#D0D7DF] font-medium">{player.teamName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Group {player.group}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
