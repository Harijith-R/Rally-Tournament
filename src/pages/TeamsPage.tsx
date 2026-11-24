import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { GroupId } from '../types/tournament';

export const TeamsPage: React.FC = () => {
  const { data, getPlayersByTeam } = useTournament();
  const [groupFilter, setGroupFilter] = useState<'ALL' | GroupId>('ALL');

  useDocumentMeta(
    'Teams | RALLY 2026',
    'Explore all six official teams competing in RALLY TOURNAMENT 2026 across Group A and Group B.'
  );

  const visibleTeams = useMemo(() => {
    if (!data) return [];
    if (groupFilter === 'ALL') return data.teams;
    return data.teams.filter((t) => t.group === groupFilter);
  }, [data, groupFilter]);

  if (!data) return null;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10 mb-12">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Official Competing Squads
            </p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
              TEAMS
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
              Six championship squads comprising sixty-eight players split equally between Group A
              (Teams 1, 3, 5) and Group B (Teams 2, 4, 6).
            </p>
          </div>

          {/* Interactive Group Filter Controls */}
          <div className="inline-flex items-center border border-white/15 bg-[#17212B] p-1 self-start md:self-auto">
            {(['ALL', 'A', 'B'] as const).map((tab) => {
              const active = groupFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setGroupFilter(tab)}
                  className={`px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#A3E635] text-[#101820]'
                      : 'text-[#AAB3BD] hover:text-white'
                  }`}
                >
                  {tab === 'ALL' ? 'All Teams (6)' : `Group ${tab} (3)`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Six Premium Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleTeams.map((team) => {
            const roster = getPlayersByTeam(team.id);
            const previewNames = roster.slice(0, 4).map((p) => p.name).join(' · ');

            return (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group relative flex flex-col justify-between border border-white/10 bg-[#17212B] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-white/30"
              >
                <div
                  className="absolute top-0 inset-x-0 h-[3px]"
                  style={{ backgroundColor: team.color }}
                />

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-4xl font-bold tracking-[0.06em] text-white">
                        {team.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#C0C0C0] uppercase tabular-nums">
                        <span>{team.playerCount} PLAYERS</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#A3E635]">GROUP {team.group}</span>
                      </div>
                    </div>

                    <TeamEmblem
                      variant={team.emblemVariant}
                      color={team.color}
                      number={team.number}
                      size={64}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  {/* Subtle Identity Bar & Roster Preview */}
                  <div className="mt-7 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-[#AAB3BD] mb-2">
                      <span>Squad Preview</span>
                      <span className="tabular-nums">+{roster.length - 4} more</span>
                    </div>
                    <p className="text-sm text-[#D0D7DF] leading-relaxed">{previewNames}</p>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#AAB3BD]">
                    <span
                      className="inline-block h-2.5 w-6"
                      style={{ backgroundColor: team.color }}
                      aria-hidden="true"
                    />
                    <span>Team 0{team.number}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] text-white uppercase group-hover:text-[#A3E635] transition-colors">
                    <span>View Squad</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
