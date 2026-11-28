import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { prefersReducedMotion } from '../components/three/webglUtils';
import type { GroupId } from '../types/tournament';

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return `rgba(163, 230, 53, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const RESTING_CARD_SHADOW =
  '0 4px 18px -6px rgba(4, 8, 13, 0.36), 0 0 0 1px rgba(255, 255, 255, 0), 0 0 0 0 rgba(0, 0, 0, 0)';

export const TeamsPage: React.FC = () => {
  const { data, getPlayersByTeam } = useTournament();
  const [groupFilter, setGroupFilter] = useState<'ALL' | GroupId>('ALL');
  const gridRef = useRef<HTMLDivElement | null>(null);

  useDocumentMeta(
    'Teams | RALLY 2026',
    'Explore all six official teams competing in RALLY TOURNAMENT 2026 across Group A and Group B.'
  );

  const visibleTeams = useMemo(() => {
    if (!data) return [];
    if (groupFilter === 'ALL') return data.teams;
    return data.teams.filter((t) => t.group === groupFilter);
  }, [data, groupFilter]);

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.team-card-item', {
        y: 16,
        opacity: 0,
        scale: 0.985,
        duration: 0.45,
        stagger: 0.055,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, gridRef);
    return () => ctx.revert();
  }, [groupFilter, visibleTeams.length]);

  const animateCardEnter = (el: HTMLElement, teamColor: string) => {
    if (prefersReducedMotion()) return;
    const hairline = el.querySelector<HTMLElement>('.team-card-hairline');
    const emblem = el.querySelector<HTMLElement>('.team-card-emblem');

    gsap.to(el, {
      scale: 1.022,
      y: -5,
      boxShadow: `0 26px 52px -14px rgba(4, 8, 13, 0.84), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 10px 30px -10px ${hexToRgba(
        teamColor,
        0.24
      )}`,
      duration: 0.34,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (hairline) {
      gsap.to(hairline, {
        scaleY: 1.45,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    if (emblem) {
      gsap.to(emblem, {
        scale: 1.06,
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const animateCardLeave = (el: HTMLElement) => {
    if (prefersReducedMotion()) return;
    const hairline = el.querySelector<HTMLElement>('.team-card-hairline');
    const emblem = el.querySelector<HTMLElement>('.team-card-emblem');

    gsap.to(el, {
      scale: 1,
      y: 0,
      boxShadow: RESTING_CARD_SHADOW,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (hairline) {
      gsap.to(hairline, {
        scaleY: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    if (emblem) {
      gsap.to(emblem, {
        scale: 1,
        duration: 0.38,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const animateCardPress = (el: HTMLElement) => {
    if (prefersReducedMotion()) return;
    gsap.to(el, {
      scale: 1.006,
      y: -2,
      duration: 0.14,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

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
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleTeams.map((team) => {
            const roster = getPlayersByTeam(team.id);
            const previewNames = roster.slice(0, 4).map((p) => p.name).join(' · ');

            return (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                onMouseEnter={(e) => animateCardEnter(e.currentTarget, team.color)}
                onMouseLeave={(e) => animateCardLeave(e.currentTarget)}
                onMouseDown={(e) => animateCardPress(e.currentTarget)}
                onFocus={(e) => animateCardEnter(e.currentTarget, team.color)}
                onBlur={(e) => animateCardLeave(e.currentTarget)}
                style={{ boxShadow: RESTING_CARD_SHADOW }}
                className="team-card-item group relative flex flex-col justify-between border border-white/10 bg-[#17212B] p-8 will-change-transform transition-colors duration-200 hover:border-white/25"
              >
                <div
                  className="team-card-hairline absolute top-0 inset-x-0 h-[3px] origin-top"
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

                    <div className="team-card-emblem shrink-0">
                      <TeamEmblem
                        variant={team.emblemVariant}
                        color={team.color}
                        number={team.number}
                        size={64}
                      />
                    </div>
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
