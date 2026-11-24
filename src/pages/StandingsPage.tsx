import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { StandingEntry } from '../types/tournament';

type StandingsView = 'groups' | 'overall';

export const StandingsPage: React.FC = () => {
  const { data, getTeamById } = useTournament();
  const [view, setView] = useState<StandingsView>('groups');

  useDocumentMeta(
    'Standings | RALLY 2026',
    'Official Group A, Group B, and overall standings tables for RALLY TOURNAMENT 2026.'
  );

  if (!data) return null;

  const { standings } = data;

  const renderTable = (title: string, subtitle: string, entries: StandingEntry[]) => (
    <div className="border border-white/10 bg-[#17212B] overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 px-6 py-5">
        <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-white uppercase">
          {title}
        </h2>
        <span className="text-xs tracking-[0.16em] text-[#A3E635] uppercase tabular-nums">
          {subtitle}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#101820]/60 text-[11px] font-semibold tracking-[0.16em] text-[#AAB3BD] uppercase">
              <th className="py-3.5 px-6 w-20">Pos</th>
              <th className="py-3.5 px-6">Team</th>
              <th className="py-3.5 px-5 text-right">Played</th>
              <th className="py-3.5 px-5 text-right">Won</th>
              <th className="py-3.5 px-5 text-right">Lost</th>
              <th className="py-3.5 px-6 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {entries.map((row) => {
              const team = getTeamById(row.teamId);
              return (
                <tr key={row.teamId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-display text-lg text-[#AAB3BD] tabular-nums">
                    {row.position !== null ? String(row.position).padStart(2, '0') : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      to={`/teams/${row.teamId}`}
                      className="group inline-flex items-center gap-3.5"
                    >
                      {team && (
                        <TeamEmblem
                          variant={team.emblemVariant}
                          color={team.color}
                          number={team.number}
                          size={36}
                        />
                      )}
                      <div>
                        <div className="font-display text-xl font-semibold tracking-wide text-white group-hover:text-[#A3E635] transition-colors">
                          {team?.name ?? row.teamId}
                        </div>
                        {team && (
                          <div className="text-xs text-[#AAB3BD] tabular-nums">
                            Group {team.group} · {team.playerCount} Players
                          </div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-5 text-right text-sm text-[#D0D7DF] tabular-nums">
                    {row.played}
                  </td>
                  <td className="py-4 px-5 text-right text-sm text-[#D0D7DF] tabular-nums">
                    {row.won}
                  </td>
                  <td className="py-4 px-5 text-right text-sm text-[#D0D7DF] tabular-nums">
                    {row.lost}
                  </td>
                  <td className="py-4 px-6 text-right font-display text-xl font-bold text-[#A3E635] tabular-nums">
                    {row.points !== null ? row.points : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10 mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Championship Tables
            </p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
              STANDINGS
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
              Official Group A, Group B, and overall tournament rankings across all six RALLY 2026
              teams.
            </p>
          </div>

          <div className="inline-flex items-center border border-white/15 bg-[#17212B] p-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setView('groups')}
              className={`px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors whitespace-nowrap ${
                view === 'groups' ? 'bg-[#A3E635] text-[#101820]' : 'text-[#AAB3BD] hover:text-white'
              }`}
            >
              Group Tables
            </button>
            <button
              type="button"
              onClick={() => setView('overall')}
              className={`px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors whitespace-nowrap ${
                view === 'overall' ? 'bg-[#A3E635] text-[#101820]' : 'text-[#AAB3BD] hover:text-white'
              }`}
            >
              Overall Table
            </button>
          </div>
        </div>

        {/* Official Pending Points Allocation Notice */}
        {!standings.pointsSystemConfirmed && (
          <div className="mb-10 border border-white/15 bg-[#17212B] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg tracking-[0.12em] text-white uppercase">
                Standings Status: Pre-Tournament
              </h2>
              <p className="mt-1.5 text-sm text-[#AAB3BD] max-w-3xl">
                {standings.pointsSystemNote}
              </p>
            </div>
            <Link
              to="/rules"
              className="text-xs font-semibold tracking-[0.16em] text-[#A3E635] uppercase hover:underline whitespace-nowrap shrink-0"
            >
              Official Format Rules
            </Link>
          </div>
        )}

        {/* Group A & Group B Tables */}
        {view === 'groups' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderTable('Group A', '3 Teams · 34 Players', standings.groups.A)}
            {renderTable('Group B', '3 Teams · 34 Players', standings.groups.B)}
          </div>
        ) : (
          renderTable('Overall Standings', '6 Teams · 68 Players', standings.overall)
        )}
      </div>
    </div>
  );
};
