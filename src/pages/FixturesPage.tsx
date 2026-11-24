import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { RALLY_MEDIA } from '../lib/media';

type StatusFilter = 'all' | 'upcoming' | 'completed';
type GroupFilter = 'ALL' | 'A' | 'B';

export const FixturesPage: React.FC = () => {
  const { data, getTeamById } = useTournament();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('ALL');

  useDocumentMeta(
    'Fixtures | RALLY 2026',
    'Official match schedule, court assignments, and group stage fixtures for RALLY TOURNAMENT 2026.'
  );

  const filteredMatches = useMemo(() => {
    if (!data) return [];
    return data.fixtures.matches.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (groupFilter !== 'ALL' && m.group !== groupFilter) return false;
      return true;
    });
  }, [data, statusFilter, groupFilter]);

  if (!data) return null;

  const { fixtures } = data;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-10 mb-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
            Match Schedule
          </p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
            FIXTURES
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
            Official RALLY 2026 match pairings, dates, start times, and court assignments across
            Group A and Group B.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="inline-flex items-center border border-white/15 bg-[#17212B] p-1">
            {(
              [
                { id: 'all', label: 'All Matches' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#A3E635] text-[#101820]'
                    : 'text-[#AAB3BD] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center border border-white/15 bg-[#17212B] p-1">
            {(
              [
                { id: 'ALL', label: 'All Groups' },
                { id: 'A', label: 'Group A' },
                { id: 'B', label: 'Group B' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGroupFilter(tab.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                  groupFilter === tab.id
                    ? 'bg-white text-[#101820]'
                    : 'text-[#AAB3BD] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fixture List or Official Pending State */}
        {fixtures.matches.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-[#17212B] overflow-hidden">
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
              <Calendar className="h-9 w-9 text-[#A3E635] mb-5" />
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {fixtures.emptyHeadline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#AAB3BD]">
                {fixtures.emptyDescription}
              </p>

              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-6 text-xs text-[#AAB3BD]">
                <div>
                  <div className="font-display text-base tracking-wider text-white uppercase">
                    Group A Teams
                  </div>
                  <p className="mt-1">Team 1 · Team 3 · Team 5</p>
                </div>
                <div>
                  <div className="font-display text-base tracking-wider text-white uppercase">
                    Group B Teams
                  </div>
                  <p className="mt-1">Team 2 · Team 4 · Team 6</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/teams"
                  className="inline-flex items-center gap-2 bg-[#A3E635] px-6 py-3 text-xs font-semibold tracking-[0.14em] text-[#101820] uppercase hover:bg-[#b5f24d] transition-colors"
                >
                  <span>Explore Competing Teams</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/rules"
                  className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold tracking-[0.14em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
                >
                  <span>Review Match Format</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[280px] bg-[#101820]">
              <img
                src={RALLY_MEDIA.shuttlecockNetDetail}
                alt="Feather shuttlecock suspended above championship badminton net"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/75 via-transparent to-transparent" />
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="border border-white/10 bg-[#17212B] p-12 text-center">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white uppercase">
              No Matches for Selected Filters
            </h2>
            <p className="mt-2 text-sm text-[#AAB3BD]">
              Try switching status or group filters to view scheduled fixtures.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => {
              const teamA = getTeamById(match.teamAId);
              const teamB = getTeamById(match.teamBId);
              return (
                <div
                  key={match.id}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 border border-white/10 bg-[#17212B] p-6"
                >
                  <div className="md:col-span-3">
                    <div className="font-display text-sm tracking-[0.16em] text-[#A3E635] uppercase tabular-nums">
                      Match {String(match.matchNumber).padStart(2, '0')} · Group {match.group}
                    </div>
                    <div className="mt-1 text-xs text-[#AAB3BD] tabular-nums">
                      {match.date} · {match.time}
                    </div>
                  </div>

                  <div className="md:col-span-6 flex items-center justify-center gap-5">
                    <div className="flex items-center gap-3">
                      {teamA && (
                        <TeamEmblem
                          variant={teamA.emblemVariant}
                          color={teamA.color}
                          number={teamA.number}
                          size={40}
                        />
                      )}
                      <span className="font-display text-2xl font-bold text-white">
                        {teamA?.name ?? match.teamAId}
                      </span>
                    </div>
                    <span className="font-display text-sm tracking-[0.2em] text-[#AAB3BD] uppercase">
                      VS
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-bold text-white">
                        {teamB?.name ?? match.teamBId}
                      </span>
                      {teamB && (
                        <TeamEmblem
                          variant={teamB.emblemVariant}
                          color={teamB.color}
                          number={teamB.number}
                          size={40}
                        />
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-3 md:text-right text-xs text-[#AAB3BD] uppercase tracking-wider">
                    <div className="text-white font-medium">{match.court}</div>
                    <div className="mt-1 text-[#A3E635]">{match.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
