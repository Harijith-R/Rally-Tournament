import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TrophyShowcaseCanvas = lazy(() =>
  import('../components/three/TrophyShowcaseCanvas').then((m) => ({
    default: m.TrophyShowcaseCanvas,
  }))
);

export const ChampionsPage: React.FC = () => {
  const { data, getTeamById, getPlayersByTeam } = useTournament();

  useDocumentMeta(
    'Champions | RALLY 2026',
    'Hall of Champions and the original RALLY 2026 Championship Trophy.'
  );

  if (!data) return null;

  const { tournament, teams } = data;
  const { champion } = tournament;
  const winningTeam = champion.announced && champion.teamId ? getTeamById(champion.teamId) : undefined;
  const winningRoster = winningTeam ? getPlayersByTeam(winningTeam.id) : [];

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-[0.24em] text-[#A3E635] uppercase">
            RALLY TOURNAMENT 2026 · Hall of Honour
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl font-bold tracking-[0.08em] text-white uppercase leading-none">
            {champion.announced && winningTeam ? `${winningTeam.name} — CHAMPIONS` : champion.headline}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#AAB3BD]">
            {champion.announced && champion.summary
              ? champion.summary
              : 'Six teams and sixty-eight athletes compete for the original sculpted RALLY 2026 Championship Trophy.'}
          </p>
        </div>

        {/* Centerpiece: Original 3D RALLY Championship Trophy */}
        <section className="mb-16">
          <Suspense
            fallback={
              <div className="flex h-[520px] items-center justify-center border border-white/10 bg-[#17212B] text-xs tracking-[0.2em] text-[#AAB3BD] uppercase">
                Loading 3D RALLY 2026 Trophy…
              </div>
            }
          >
            <TrophyShowcaseCanvas
              trophyGlbUrl={tournament.assets?.trophyGlbUrl}
              heightClass="h-[460px] sm:h-[580px]"
              celebration={champion.announced}
            />
          </Suspense>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#AAB3BD]">
            <span>Original RALLY 2026 Championship Trophy · Engraved Metallic Silver &amp; Obsidian</span>
            <span className="text-[#A3E635]">EVERY POINT MATTERS.</span>
          </div>
        </section>

        {/* Announced Champion Showcase OR Six Contenders Awaiting Coronation */}
        {champion.announced && winningTeam ? (
          <section className="space-y-12">
            <div className="border border-[#A3E635]/50 bg-[#17212B] p-8 sm:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <TeamEmblem
                    variant={winningTeam.emblemVariant}
                    color={winningTeam.color}
                    number={winningTeam.number}
                    size={88}
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#A3E635] uppercase">
                      <Award className="h-4 w-4" />
                      <span>2026 Official Champion</span>
                    </div>
                    <h2 className="mt-2 font-display text-5xl font-bold text-white">
                      {winningTeam.name}
                    </h2>
                    <div className="mt-1 text-xs text-[#AAB3BD] tabular-nums">
                      Group {winningTeam.group} · {winningTeam.playerCount} Players
                      {champion.crownedDate ? ` · Crowned ${champion.crownedDate}` : ''}
                    </div>
                  </div>
                </div>

                {champion.finalScore && (
                  <div className="border border-white/10 bg-[#101820] px-8 py-5 text-center">
                    <div className="text-xs tracking-[0.18em] text-[#AAB3BD] uppercase">
                      Championship Final
                    </div>
                    <div className="mt-1 font-display text-4xl font-bold text-[#A3E635] tabular-nums">
                      {champion.finalScore}
                    </div>
                  </div>
                )}
              </div>

              {/* Championship Winning Roster */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <h3 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase mb-5">
                  Championship Roster
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {winningRoster.map((player) => (
                    <div
                      key={player.id}
                      className="border border-white/10 bg-[#101820] px-4 py-3 text-sm text-white font-medium"
                    >
                      {player.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {champion.photos.length > 0 && (
              <div>
                <h3 className="font-display text-3xl font-bold tracking-[0.08em] text-white uppercase mb-6">
                  Championship Moments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {champion.photos.map((photo, idx) => (
                    <figure key={idx} className="border border-white/10 bg-[#17212B] overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-video object-cover"
                      />
                      <figcaption className="px-5 py-3.5 text-xs text-[#AAB3BD]">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="border border-white/10 bg-[#17212B] p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <p className="text-xs tracking-[0.2em] text-[#A3E635] uppercase">
                  Six Contenders · One Crown
                </p>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white uppercase">
                  IN CONTENTION FOR 2026
                </h2>
              </div>
              <span className="text-xs text-[#AAB3BD] tabular-nums">
                Winner to be engraved upon completion of the Final
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="group flex items-center justify-between gap-4 border border-white/10 bg-[#101820] p-5 hover:border-white/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <TeamEmblem
                      variant={team.emblemVariant}
                      color={team.color}
                      number={team.number}
                      size={44}
                    />
                    <div>
                      <div className="font-display text-2xl font-bold text-white group-hover:text-[#A3E635] transition-colors">
                        {team.name}
                      </div>
                      <div className="text-xs text-[#AAB3BD] tabular-nums">
                        Group {team.group} · {team.playerCount} Players
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#AAB3BD] group-hover:text-[#A3E635]" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
