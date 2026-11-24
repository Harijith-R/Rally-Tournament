import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, getTeamById, getPlayersByTeam } = useTournament();

  const team = teamId ? getTeamById(teamId) : undefined;
  const roster = team ? getPlayersByTeam(team.id) : [];

  useDocumentMeta(
    team ? `${team.name} | RALLY 2026` : 'Team Not Found | RALLY 2026',
    team
      ? `Official roster and Group ${team.group} profile for ${team.name} (${team.playerCount} players) in RALLY TOURNAMENT 2026.`
      : 'Team profile in RALLY TOURNAMENT 2026.'
  );

  if (!data) return null;

  if (!team) {
    return (
      <div className="pt-32 pb-24 mx-auto max-w-[1360px] px-5 sm:px-8">
        <h1 className="font-display text-4xl font-bold text-white uppercase">Team Not Found</h1>
        <p className="mt-3 text-sm text-[#AAB3BD]">
          The requested team profile does not exist in RALLY TOURNAMENT 2026.
        </p>
        <Link
          to="/teams"
          className="mt-6 inline-flex items-center gap-2 bg-[#A3E635] px-5 py-3 text-xs font-semibold tracking-widest text-[#101820] uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Teams</span>
        </Link>
      </div>
    );
  }

  const standing = data.standings.overall.find((s) => s.teamId === team.id);
  const teamResults = data.results.matches.filter(
    (m) => m.teamAId === team.id || m.teamBId === team.id
  );
  const groupPeers = data.teams.filter((t) => t.group === team.group && t.id !== team.id);

  return (
    <div className="pt-24 pb-24">
      {/* Team Hero Identity Header */}
      <section className="relative border-b border-white/10 bg-[#17212B] overflow-hidden">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: team.color }}
        />
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 py-12 sm:py-16">
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#AAB3BD] uppercase hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Teams</span>
          </Link>

          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <TeamEmblem
                variant={team.emblemVariant}
                color={team.color}
                number={team.number}
                size={88}
                className="shrink-0"
              />
              <div>
                <div className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-[#C0C0C0] uppercase tabular-nums">
                  <span className="text-[#A3E635]">GROUP {team.group}</span>
                  <span aria-hidden="true">·</span>
                  <span>{team.playerCount} REGISTERED PLAYERS</span>
                </div>
                <h1 className="mt-2 font-display text-5xl sm:text-7xl font-bold tracking-[0.06em] text-white leading-none">
                  {team.name}
                </h1>
                <p className="mt-3 text-sm text-[#AAB3BD]">
                  Official Men&apos;s Doubles Championship Squad · RALLY TOURNAMENT 2026
                </p>
              </div>
            </div>

            {/* Compact Team Statistics Strip */}
            <div className="grid grid-cols-3 gap-6 border border-white/10 bg-[#101820] px-6 py-5">
              <div>
                <div className="font-display text-3xl font-bold text-white tabular-nums">
                  {standing?.played ?? 0}
                </div>
                <div className="mt-1 text-[11px] tracking-[0.16em] text-[#AAB3BD] uppercase">
                  Played
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#A3E635] tabular-nums">
                  {standing?.won ?? 0}
                </div>
                <div className="mt-1 text-[11px] tracking-[0.16em] text-[#AAB3BD] uppercase">
                  Won
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-white tabular-nums">
                  {standing?.lost ?? 0}
                </div>
                <div className="mt-1 text-[11px] tracking-[0.16em] text-[#AAB3BD] uppercase">
                  Lost
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Squad Roster */}
      <section className="mx-auto max-w-[1360px] px-5 sm:px-8 pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#A3E635] uppercase">
              Official Squad List
            </p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-[0.06em] text-white uppercase">
              COMPLETE ROSTER ({roster.length})
            </h2>
          </div>
          <Link
            to="/players"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#C0C0C0] uppercase hover:text-[#A3E635] transition-colors"
          >
            <span>Search Full 68-Player Directory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roster.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between gap-4 border border-white/10 bg-[#17212B] p-5 transition-colors hover:border-white/25"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Architectural Initials Portrait */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 bg-[#101820] font-display text-lg font-bold tracking-wider text-white"
                  style={{ boxShadow: `inset 0 -2px 0 0 ${team.color}` }}
                >
                  {player.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl font-semibold tracking-wide text-white truncate">
                    {player.name}
                  </div>
                  <div className="mt-0.5 text-xs text-[#AAB3BD] tabular-nums">
                    {team.name} · Group {player.group}
                  </div>
                </div>
              </div>

              <span className="font-display text-lg font-medium text-[#6C7A89] tabular-nums shrink-0">
                {String(player.order).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Team Statistics & Group Context */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 border border-white/10 bg-[#17212B] p-7">
            <h3 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase">
              TEAM MATCH HISTORY
            </h3>
            {teamResults.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-[#AAB3BD]">
                No completed matches recorded yet for {team.name}. Match scores, mandatory
                elimination checkpoints, and squad participation logs will appear here automatically
                once official results are published.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-white/10">
                {teamResults.map((match) => {
                  const opponentId = match.teamAId === team.id ? match.teamBId : match.teamAId;
                  const opponent = getTeamById(opponentId);
                  const won = match.winnerTeamId === team.id;
                  return (
                    <Link
                      key={match.id}
                      to={`/results/${match.id}`}
                      className="flex items-center justify-between py-4 hover:bg-white/[0.02]"
                    >
                      <div>
                        <div className="text-xs text-[#AAB3BD] tabular-nums">
                          Match {String(match.matchNumber).padStart(2, '0')} · {match.date}
                        </div>
                        <div className="mt-1 font-display text-lg text-white">
                          vs {opponent?.name ?? opponentId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold tabular-nums text-white">
                          {match.scoreA} – {match.scoreB}
                        </div>
                        <div
                          className={`text-xs uppercase tracking-wider ${
                            won ? 'text-[#A3E635]' : 'text-[#AAB3BD]'
                          }`}
                        >
                          {won ? 'Victory' : 'Defeat'}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 border border-white/10 bg-[#17212B] p-7">
            <h3 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase">
              GROUP {team.group} OPPONENTS
            </h3>
            <div className="mt-5 divide-y divide-white/10">
              {groupPeers.map((peer) => (
                <Link
                  key={peer.id}
                  to={`/teams/${peer.id}`}
                  className="group flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3.5">
                    <TeamEmblem
                      variant={peer.emblemVariant}
                      color={peer.color}
                      number={peer.number}
                      size={40}
                    />
                    <div>
                      <div className="font-display text-xl text-white group-hover:text-[#A3E635] transition-colors">
                        {peer.name}
                      </div>
                      <div className="text-xs text-[#AAB3BD] tabular-nums">
                        {peer.playerCount} Players · Group {peer.group}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#AAB3BD] group-hover:text-[#A3E635] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
