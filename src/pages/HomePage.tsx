import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Calendar, ChevronRight, Play, Trophy } from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { MilestoneDiagram } from '../components/MilestoneDiagram';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { RALLY_MEDIA } from '../lib/media';
import { prefersReducedMotion } from '../components/three/webglUtils';

const TrophyShowcaseCanvas = lazy(() =>
  import('../components/three/TrophyShowcaseCanvas').then((m) => ({
    default: m.TrophyShowcaseCanvas,
  }))
);

interface HomePageProps {
  onReplayIntro: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onReplayIntro }) => {
  const { data, getTeamById } = useTournament();
  const heroTextRef = useRef<HTMLDivElement | null>(null);

  useDocumentMeta(
    'RALLY 2026 | Every Point Matters',
    "Rally 2026 – A premium men's doubles badminton championship featuring six teams and 68 players."
  );

  useEffect(() => {
    if (prefersReducedMotion() || !heroTextRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, heroTextRef);
    return () => ctx.revert();
  }, []);

  if (!data) return null;

  const { tournament, teams, fixtures, results, rules } = data;
  const groupATeams = teams.filter((t) => t.group === 'A');
  const groupBTeams = teams.filter((t) => t.group === 'B');
  const upcomingFixtures = fixtures.matches.filter((m) => m.status === 'upcoming').slice(0, 4);
  const latestResults = results.matches.slice(0, 4);

  return (
    <div className="w-full">
      {/* SECTION 2: MAIN HERO */}
      <section className="relative min-h-[88vh] flex items-end pb-16 sm:pb-24 pt-28 overflow-hidden border-b border-white/10">
        <img
          src={RALLY_MEDIA.heroArenaBackdrop}
          alt="RALLY 2026 International Indoor Badminton Championship Arena"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/82 to-[#101820]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-[#101820]/55" />

        <div ref={heroTextRef} className="relative z-10 mx-auto w-full max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-2xl">
            <div className="hero-reveal flex items-center gap-3 text-xs font-medium tracking-[0.22em] text-[#C0C0C0] uppercase">
              <span>{tournament.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#A3E635]">Season 2026</span>
            </div>

            <h1 className="hero-reveal mt-4 font-display text-6xl sm:text-8xl lg:text-[104px] font-bold tracking-[0.06em] text-white leading-[0.94]">
              {tournament.brand}
            </h1>

            <p className="hero-reveal mt-4 font-display text-2xl sm:text-4xl font-medium tracking-[0.16em] text-[#A3E635]">
              {tournament.tagline}
            </p>

            <p className="hero-reveal mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#D0D7DF]">
              {tournament.description}
            </p>

            <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/teams"
                className="inline-flex items-center gap-2.5 bg-[#A3E635] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#101820] uppercase hover:bg-[#b5f24d] transition-colors whitespace-nowrap"
              >
                <span>EXPLORE TEAMS</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/fixtures"
                className="inline-flex items-center gap-2.5 border border-white/25 bg-[#101820]/80 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors whitespace-nowrap"
              >
                <span>VIEW FIXTURES</span>
              </Link>

              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center gap-2 px-3 py-3 text-xs font-medium tracking-[0.14em] text-[#AAB3BD] uppercase hover:text-white transition-colors whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5 text-[#A3E635]" />
                <span>Replay 3D Intro</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TOURNAMENT STATISTICS */}
      <section className="border-b border-white/10 bg-[#17212B]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {[
              { value: tournament.stats.teams, padZero: true, label: 'TEAMS', sub: 'Two Balanced Groups' },
              { value: tournament.stats.players, padZero: false, label: 'PLAYERS', sub: 'Verified Squad Rosters' },
              { value: tournament.stats.groups, padZero: true, label: 'GROUPS', sub: '34 Players per Group' },
              {
                value: tournament.stats.winningPoints,
                padZero: false,
                label: 'WINNING POINTS',
                sub: 'Elimination at 25 / 50 / 75',
                accent: true,
              },
            ].map((stat) => (
              <div key={stat.label} className="py-10 sm:py-12 px-4 sm:px-8 first:pl-0 last:pr-0">
                <div
                  className={`font-display text-5xl sm:text-6xl font-bold leading-none ${
                    stat.accent ? 'text-[#A3E635]' : 'text-white'
                  }`}
                >
                  <AnimatedCounter value={stat.value} padZero={stat.padZero} />
                </div>
                <div className="mt-3 font-display text-sm tracking-[0.18em] text-white uppercase">
                  {stat.label}
                </div>
                <p className="mt-1 text-xs text-[#AAB3BD]">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MEET THE TEAMS */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#101820]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
                Championship Lineup
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-[0.06em] text-white uppercase">
                MEET THE TEAMS
              </h2>
            </div>
            <Link
              to="/teams"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#C0C0C0] uppercase hover:text-[#A3E635] transition-colors whitespace-nowrap"
            >
              <span>All Six Teams</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group relative flex flex-col justify-between border border-white/10 bg-[#17212B] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-white/30"
              >
                {/* Top team colour hairline */}
                <div
                  className="absolute top-0 inset-x-0 h-[3px]"
                  style={{ backgroundColor: team.color }}
                />

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.16em] text-[#AAB3BD] uppercase tabular-nums">
                        Group {team.group} · {team.playerCount} Players
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold tracking-[0.06em] text-white">
                        {team.name}
                      </h3>
                    </div>
                    <TeamEmblem
                      variant={team.emblemVariant}
                      color={team.color}
                      number={team.number}
                      size={56}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-3 text-xs text-[#AAB3BD]">
                    <span
                      className="inline-block h-2.5 w-6"
                      style={{ backgroundColor: team.color }}
                      aria-hidden="true"
                    />
                    <span>Team Identity 0{team.number}</span>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-semibold tracking-[0.16em] text-white uppercase group-hover:text-[#A3E635] transition-colors">
                  <span>VIEW TEAM</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TOURNAMENT GROUPS */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#141E28]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
              Official Allocation
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-[0.06em] text-white uppercase">
              TOURNAMENT GROUPS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#AAB3BD]">
              Sixty-eight registered players distributed evenly across two thirty-four-player
              groups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { title: 'GROUP A', subtitle: '34 Players · 3 Teams', list: groupATeams },
              { title: 'GROUP B', subtitle: '34 Players · 3 Teams', list: groupBTeams },
            ].map((group) => (
              <div key={group.title} className="border border-white/10 bg-[#17212B] p-7 sm:p-9">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                  <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.08em] text-white">
                    {group.title}
                  </h3>
                  <span className="text-xs font-medium tracking-[0.16em] text-[#A3E635] uppercase tabular-nums">
                    {group.subtitle}
                  </span>
                </div>

                <div className="divide-y divide-white/10">
                  {group.list.map((team) => (
                    <Link
                      key={team.id}
                      to={`/teams/${team.id}`}
                      className="group flex items-center justify-between gap-4 py-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <TeamEmblem
                          variant={team.emblemVariant}
                          color={team.color}
                          number={team.number}
                          size={44}
                        />
                        <div>
                          <div className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-[#A3E635] transition-colors">
                            {team.name}
                          </div>
                          <div className="text-xs text-[#AAB3BD] tabular-nums">
                            {team.playerCount} Players · Group {team.group}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[#C0C0C0] uppercase group-hover:text-white">
                        <span>Roster</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: FIXTURES & LATEST RESULTS */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#101820]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Section 6: Fixtures */}
          <div className="flex flex-col justify-between border border-white/10 bg-[#17212B] p-7 sm:p-9">
            <div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div>
                  <p className="text-xs tracking-[0.2em] text-[#A3E635] uppercase">Schedule</p>
                  <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white">
                    UPCOMING FIXTURES
                  </h2>
                </div>
                <Link
                  to="/fixtures"
                  className="text-xs font-semibold tracking-[0.14em] text-[#C0C0C0] uppercase hover:text-[#A3E635] transition-colors whitespace-nowrap"
                >
                  Full Schedule
                </Link>
              </div>

              {upcomingFixtures.length === 0 ? (
                <div className="py-8">
                  <Calendar className="h-8 w-8 text-[#A3E635] mb-4" />
                  <h3 className="font-display text-2xl tracking-[0.1em] text-white uppercase">
                    {fixtures.emptyHeadline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#AAB3BD] max-w-md">
                    {fixtures.emptyDescription}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {upcomingFixtures.map((match) => {
                    const teamA = getTeamById(match.teamAId);
                    const teamB = getTeamById(match.teamBId);
                    return (
                      <div key={match.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-[#AAB3BD] tabular-nums">
                            Match {String(match.matchNumber).padStart(2, '0')} · Group {match.group} ·{' '}
                            {match.date} · {match.time}
                          </div>
                          <div className="mt-1 font-display text-xl tracking-wide text-white">
                            {teamA?.name ?? match.teamAId} <span className="text-[#AAB3BD]">vs</span>{' '}
                            {teamB?.name ?? match.teamBId}
                          </div>
                        </div>
                        <span className="text-xs text-[#A3E635] uppercase tracking-wider">
                          {match.court}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to="/fixtures"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:text-[#A3E635] transition-colors"
              >
                <span>Open Fixtures Page</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Section 7: Latest Results */}
          <div className="flex flex-col justify-between border border-white/10 bg-[#17212B] p-7 sm:p-9">
            <div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div>
                  <p className="text-xs tracking-[0.2em] text-[#A3E635] uppercase">Match Outcomes</p>
                  <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white">
                    LATEST RESULTS
                  </h2>
                </div>
                <Link
                  to="/results"
                  className="text-xs font-semibold tracking-[0.14em] text-[#C0C0C0] uppercase hover:text-[#A3E635] transition-colors whitespace-nowrap"
                >
                  All Results
                </Link>
              </div>

              {latestResults.length === 0 ? (
                <div className="py-8">
                  <Trophy className="h-8 w-8 text-[#C0C0C0] mb-4" />
                  <h3 className="font-display text-2xl tracking-[0.1em] text-white uppercase">
                    {results.emptyHeadline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#AAB3BD] max-w-md">
                    {results.emptyDescription}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {latestResults.map((match) => {
                    const teamA = getTeamById(match.teamAId);
                    const teamB = getTeamById(match.teamBId);
                    return (
                      <Link
                        key={match.id}
                        to={`/results/${match.id}`}
                        className="py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div>
                          <div className="text-xs text-[#AAB3BD] tabular-nums">
                            Match {String(match.matchNumber).padStart(2, '0')} · Group {match.group} ·{' '}
                            {match.date}
                          </div>
                          <div className="mt-1 font-display text-xl tracking-wide text-white">
                            {teamA?.name ?? match.teamAId} vs {teamB?.name ?? match.teamBId}
                          </div>
                        </div>
                        <div className="font-display text-2xl font-bold tabular-nums text-[#A3E635]">
                          {match.scoreA} – {match.scoreB}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to="/results"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:text-[#A3E635] transition-colors"
              >
                <span>Open Results Archive</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: TOURNAMENT FORMAT */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#141E28]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-14">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
                100-Point Men&apos;s Doubles Format
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-[0.06em] text-white uppercase">
                STRATEGY AT EVERY CHECKPOINT
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#AAB3BD]">
                {rules.formatOverview.summary}
              </p>
              <div className="mt-8">
                <Link
                  to="/rules"
                  className="inline-flex items-center gap-2.5 border border-white/20 bg-[#17212B] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
                >
                  <span>READ ALL 10 OFFICIAL RULES</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[260px] overflow-hidden border border-white/10 bg-[#101820]">
                <img
                  src={RALLY_MEDIA.courtGeometryEditorial}
                  alt="RALLY 2026 Championship Badminton Court Geometry"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-[#D0D7DF] tabular-nums">
                  <span>Men&apos;s Doubles · 2 Active Players per Team</span>
                  <span className="text-[#A3E635]">0–0 to 100 Points</span>
                </div>
              </div>
            </div>
          </div>

          <MilestoneDiagram milestones={rules.milestones} compact />
        </div>
      </section>

      {/* SECTION 9: CHAMPIONSHIP TROPHY */}
      <section className="py-20 sm:py-28 bg-[#101820]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-[0.22em] text-[#A3E635] uppercase">
                The Ultimate Prize
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-[0.06em] text-white uppercase">
                THE ORIGINAL RALLY TROPHY
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#AAB3BD]">
                Commissioned exclusively for RALLY TOURNAMENT 2026. Sculpted in brushed metallic
                silver with twin sweeping arcs inspired by badminton rackets, crowned by a twelve-blade
                shuttlecock crest, and anchored on a circular obsidian base engraved with{' '}
                <span className="text-white font-medium">RALLY 2026</span>.
              </p>

              <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2.5">
                  <dt className="text-[#AAB3BD]">Architecture</dt>
                  <dd className="text-white">Twin Racket Sweeps &amp; 12-Blade Crown</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2.5">
                  <dt className="text-[#AAB3BD]">Finish</dt>
                  <dd className="text-white">Brushed Silver · Obsidian Plinth · Lime Illumination</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#AAB3BD]">Status</dt>
                  <dd className="text-[#A3E635]">
                    {tournament.champion.announced ? 'Awarded' : 'Awaiting 2026 Champions'}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/champions"
                  className="inline-flex items-center gap-2.5 bg-[#A3E635] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#101820] uppercase hover:bg-[#b5f24d] transition-colors"
                >
                  <span>VISIT CHAMPIONS HALL</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="flex h-[460px] items-center justify-center border border-white/10 bg-[#17212B] text-xs tracking-[0.2em] text-[#AAB3BD] uppercase">
                    Loading 3D Trophy Showcase…
                  </div>
                }
              >
                <TrophyShowcaseCanvas
                  trophyGlbUrl={tournament.assets?.trophyGlbUrl}
                  heightClass="h-[440px] sm:h-[520px]"
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
