import React from 'react';
import { MilestoneDiagram } from '../components/MilestoneDiagram';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { RALLY_MEDIA } from '../lib/media';

export const RulesPage: React.FC = () => {
  const { data } = useTournament();

  useDocumentMeta(
    'Official Rules | RALLY 2026',
    'Official 100-point Men’s Doubles format, 25/50/75 mandatory elimination milestones, and participation rules for RALLY 2026.'
  );

  if (!data) return null;

  const { rules } = data;
  const { formatOverview, milestones, officialRules } = rules;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-10 mb-12">
          <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
            Championship Regulations
          </p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-[0.06em] text-white uppercase">
            OFFICIAL RULES
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AAB3BD]">
            Every point, substitution, and mandatory elimination checkpoint is governed by the
            RALLY 2026 100-point championship regulations.
          </p>
        </div>

        {/* Match Format Overview + Editorial Court Visual */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-6 border border-white/10 bg-[#17212B] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#A3E635] uppercase">Match Format</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white uppercase">
                {formatOverview.discipline} · 100-Point Race
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#AAB3BD]">
                {formatOverview.summary}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <div className="font-display text-2xl font-bold text-white">Doubles</div>
                <div className="text-xs text-[#AAB3BD] mt-0.5">Men&apos;s Format</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white tabular-nums">
                  {formatOverview.onCourtPerTeam} v {formatOverview.onCourtPerTeam}
                </div>
                <div className="text-xs text-[#AAB3BD] mt-0.5">Active on Court</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white tabular-nums">
                  {formatOverview.startingScore}
                </div>
                <div className="text-xs text-[#AAB3BD] mt-0.5">Match Start</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-[#A3E635] tabular-nums">
                  {formatOverview.winningTarget} PTS
                </div>
                <div className="text-xs text-[#AAB3BD] mt-0.5">Winning Target</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[280px] overflow-hidden border border-white/10 bg-[#101820]">
            <img
              src={RALLY_MEDIA.courtGeometryEditorial}
              alt="Official RALLY 2026 Championship Badminton Court"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 text-xs text-[#D0D7DF]">
              Mandatory elimination checkpoints occur at 25, 50, and 75 points.
            </div>
          </div>
        </section>

        {/* Visual 25 / 50 / 75 / 100 Milestone Diagram */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Progression Architecture
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white uppercase">
              ELIMINATION MILESTONES
            </h2>
          </div>

          <MilestoneDiagram milestones={milestones} />
        </section>

        {/* All 10 Official Rules */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Match Governance
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white uppercase">
              TEN OFFICIAL COMPETITION RULES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {officialRules.map((rule) => {
              const isCriticalForfeit = rule.number === 10;
              return (
                <article
                  key={rule.number}
                  className={`border p-6 sm:p-7 ${
                    isCriticalForfeit
                      ? 'border-[#A3E635]/50 bg-[#17212B]'
                      : 'border-white/10 bg-[#17212B]'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5 mb-4">
                    <span
                      className={`font-display text-3xl font-bold leading-none tabular-nums ${
                        isCriticalForfeit ? 'text-[#A3E635]' : 'text-[#C0C0C0]'
                      }`}
                    >
                      {String(rule.number).padStart(2, '0')}
                    </span>
                    <span className="text-xs tracking-[0.16em] text-[#AAB3BD] uppercase">
                      {rule.category}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-wide text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#AAB3BD]">
                    {rule.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
