import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Trophy } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { RALLY_MEDIA } from '../lib/media';

export const ResultsPage: React.FC = () => {
  const { data, getTeamById } = useTournament();
  const [groupFilter, setGroupFilter] = useState<'ALL' | 'A' | 'B'>('ALL');

  useDocumentMeta(
    'Results | RALLY 2026',
    'Official completed match results, final scores, and match summaries for RALLY TOURNAMENT 2026.'
  );

  const filteredResults = useMemo(() => {
    if (!data) return [];
    if (groupFilter === 'ALL') return data.results.matches;
    return data.results.matches.filter((m) => m.group === groupFilter);
  }, [data, groupFilter]);

  if (!data) return null;

  const { results } = data;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10 mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Verified Match Outcomes
            </p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
              RESULTS
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
              Completed RALLY 2026 match results published directly by the tournament organisers.
              Select any completed match to inspect participation, substitutions, and mandatory
              elimination checkpoints.
            </p>
          </div>

          <div className="inline-flex items-center border border-white/15 bg-[#17212B] p-1 self-start md:self-auto">
            {(['ALL', 'A', 'B'] as const).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setGroupFilter(group)}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                  groupFilter === group
                    ? 'bg-[#A3E635] text-[#101820]'
                    : 'text-[#AAB3BD] hover:text-white'
                }`}
              >
                {group === 'ALL' ? 'All Results' : `Group ${group}`}
              </button>
            ))}
          </div>
        </div>

        {/* Empty Published State vs Completed Match Cards */}
        {results.matches.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-[#17212B] overflow-hidden">
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
              <Trophy className="h-9 w-9 text-[#C0C0C0] mb-5" />
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {results.emptyHeadline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#AAB3BD]">
                {results.emptyDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/standings"
                  className="inline-flex items-center gap-2 bg-[#A3E635] px-6 py-3 text-xs font-semibold tracking-[0.14em] text-[#101820] uppercase hover:bg-[#b5f24d] transition-colors"
                >
                  <span>View Standings Tables</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/fixtures"
                  className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold tracking-[0.14em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
                >
                  <span>View Fixtures</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[280px] bg-[#101820]">
              <img
                src={RALLY_MEDIA.courtGeometryEditorial}
                alt="RALLY 2026 Championship Court Surface"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/75 via-transparent to-transparent" />
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="border border-white/10 bg-[#17212B] p-12 text-center">
            <h2 className="font-display text-2xl text-white uppercase">
              No Completed Matches in Group {groupFilter}
            </h2>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredResults.map((match) => {
              const teamA = getTeamById(match.teamAId);
              const teamB = getTeamById(match.teamBId);
              const winner = getTeamById(match.winnerTeamId);

              return (
                <Link
                  key={match.id}
                  to={`/results/${match.id}`}
                  className="group block border border-white/10 bg-[#17212B] p-6 sm:p-8 transition-colors hover:border-white/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 text-xs text-[#AAB3BD] tabular-nums">
                    <span>
                      Match {String(match.matchNumber).padStart(2, '0')} · Group {match.group} ·{' '}
                      {match.date}
                    </span>
                    <span className="text-[#A3E635] font-medium uppercase tracking-wider">
                      Winner: {winner?.name ?? match.winnerTeamId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    <div className="md:col-span-4 flex items-center gap-3.5">
                      {teamA && (
                        <TeamEmblem
                          variant={teamA.emblemVariant}
                          color={teamA.color}
                          number={teamA.number}
                          size={48}
                        />
                      )}
                      <div>
                        <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                          {teamA?.name ?? match.teamAId}
                        </div>
                        <div className="text-xs text-[#AAB3BD]">
                          {match.winnerTeamId === match.teamAId ? 'Winning Team' : 'Contender'}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 text-center">
                      <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums text-white">
                        <span
                          className={
                            match.winnerTeamId === match.teamAId ? 'text-[#A3E635]' : 'text-white'
                          }
                        >
                          {match.scoreA}
                        </span>
                        <span className="mx-3 text-[#6C7A89]">–</span>
                        <span
                          className={
                            match.winnerTeamId === match.teamBId ? 'text-[#A3E635]' : 'text-white'
                          }
                        >
                          {match.scoreB}
                        </span>
                      </div>
                      <div className="mt-1 text-xs tracking-[0.16em] text-[#AAB3BD] uppercase">
                        Final Score
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-center md:justify-end gap-3.5">
                      <div className="md:text-right">
                        <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                          {teamB?.name ?? match.teamBId}
                        </div>
                        <div className="text-xs text-[#AAB3BD]">
                          {match.winnerTeamId === match.teamBId ? 'Winning Team' : 'Contender'}
                        </div>
                      </div>
                      {teamB && (
                        <TeamEmblem
                          variant={teamB.emblemVariant}
                          color={teamB.color}
                          number={teamB.number}
                          size={48}
                        />
                      )}
                    </div>
                  </div>

                  {match.summary && (
                    <p className="mt-6 text-sm text-[#AAB3BD] leading-relaxed">{match.summary}</p>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end text-xs font-semibold tracking-[0.14em] text-white uppercase group-hover:text-[#A3E635] transition-colors">
                    <span>View Match Report</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
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
