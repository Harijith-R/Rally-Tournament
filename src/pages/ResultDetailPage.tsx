import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TeamEmblem } from '../components/TeamEmblem';
import { useTournament } from '../context/TournamentContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const ResultDetailPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { data, getTeamById, getPlayerById } = useTournament();

  const match = data?.results.matches.find((m) => m.id === matchId);

  useDocumentMeta(
    match ? `Match ${match.matchNumber} Result | RALLY 2026` : 'Match Result | RALLY 2026',
    'Official completed match details, participation log, substitutions, and mandatory eliminations.'
  );

  if (!data) return null;

  if (!match) {
    return (
      <div className="pt-32 pb-24 mx-auto max-w-[1360px] px-5 sm:px-8">
        <h1 className="font-display text-4xl font-bold text-white uppercase">Match Not Found</h1>
        <p className="mt-3 text-sm text-[#AAB3BD]">
          No official match result record exists for this match identifier yet.
        </p>
        <Link
          to="/results"
          className="mt-6 inline-flex items-center gap-2 bg-[#A3E635] px-5 py-3 text-xs font-semibold tracking-widest text-[#101820] uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Results</span>
        </Link>
      </div>
    );
  }

  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);
  const winner = getTeamById(match.winnerTeamId);

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#AAB3BD] uppercase hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Results</span>
        </Link>

        {/* Final Result Header */}
        <section className="mt-8 border border-white/10 bg-[#17212B] p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8 text-xs text-[#AAB3BD] tabular-nums">
            <span>
              Match {String(match.matchNumber).padStart(2, '0')} · Group {match.group} ·{' '}
              {match.date}
            </span>
            <span className="text-[#A3E635] font-semibold uppercase tracking-[0.16em]">
              Winner: {winner?.name ?? match.winnerTeamId}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            <div className="md:col-span-4 flex items-center gap-4">
              {teamA && (
                <TeamEmblem
                  variant={teamA.emblemVariant}
                  color={teamA.color}
                  number={teamA.number}
                  size={64}
                />
              )}
              <div>
                <Link
                  to={`/teams/${match.teamAId}`}
                  className="font-display text-3xl sm:text-4xl font-bold text-white hover:text-[#A3E635] transition-colors"
                >
                  {teamA?.name ?? match.teamAId}
                </Link>
                <div className="text-xs text-[#AAB3BD]">Group {teamA?.group ?? match.group}</div>
              </div>
            </div>

            <div className="md:col-span-4 text-center">
              <div className="font-display text-6xl sm:text-7xl font-bold tabular-nums text-white">
                <span className={match.winnerTeamId === match.teamAId ? 'text-[#A3E635]' : ''}>
                  {match.scoreA}
                </span>
                <span className="mx-4 text-[#6C7A89]">–</span>
                <span className={match.winnerTeamId === match.teamBId ? 'text-[#A3E635]' : ''}>
                  {match.scoreB}
                </span>
              </div>
              <div className="mt-2 text-xs tracking-[0.2em] text-[#AAB3BD] uppercase">
                Final Verified Score
              </div>
            </div>

            <div className="md:col-span-4 flex items-center md:justify-end gap-4">
              <div className="md:text-right">
                <Link
                  to={`/teams/${match.teamBId}`}
                  className="font-display text-3xl sm:text-4xl font-bold text-white hover:text-[#A3E635] transition-colors"
                >
                  {teamB?.name ?? match.teamBId}
                </Link>
                <div className="text-xs text-[#AAB3BD]">Group {teamB?.group ?? match.group}</div>
              </div>
              {teamB && (
                <TeamEmblem
                  variant={teamB.emblemVariant}
                  color={teamB.color}
                  number={teamB.number}
                  size={64}
                />
              )}
            </div>
          </div>

          {match.summary && (
            <p className="mt-8 pt-6 border-t border-white/10 text-sm sm:text-base leading-relaxed text-[#D0D7DF]">
              {match.summary}
            </p>
          )}
        </section>

        {/* Sections rendered strictly when present in JSON */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {match.participation && (
            <section className="border border-white/10 bg-[#17212B] p-7">
              <h2 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase mb-5">
                Player Participation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display text-lg text-[#A3E635] mb-3">
                    {teamA?.name ?? match.teamAId}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#D0D7DF]">
                    {match.participation.teamAPlayerIds.map((pid) => (
                      <li key={pid}>{getPlayerById(pid)?.name ?? pid}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg text-[#A3E635] mb-3">
                    {teamB?.name ?? match.teamBId}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#D0D7DF]">
                    {match.participation.teamBPlayerIds.map((pid) => (
                      <li key={pid}>{getPlayerById(pid)?.name ?? pid}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {match.eliminations && match.eliminations.length > 0 && (
            <section className="border border-white/10 bg-[#17212B] p-7">
              <h2 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase mb-5">
                Mandatory Eliminations
              </h2>
              <div className="divide-y divide-white/10">
                {match.eliminations.map((ev, i) => (
                  <div key={i} className="py-3.5 text-sm">
                    <div className="flex items-center justify-between text-xs text-[#A3E635] tabular-nums">
                      <span>{ev.milestone} Points Milestone</span>
                      <span>{getTeamById(ev.teamId)?.name ?? ev.teamId}</span>
                    </div>
                    <div className="mt-1 text-[#D0D7DF]">
                      Eliminated: <strong>{getPlayerById(ev.eliminatedPlayerId)?.name ?? ev.eliminatedPlayerId}</strong> ·
                      Replaced by: <strong>{getPlayerById(ev.replacementPlayerId)?.name ?? ev.replacementPlayerId}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {match.substitutions && match.substitutions.length > 0 && (
            <section className="border border-white/10 bg-[#17212B] p-7">
              <h2 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase mb-5">
                Voluntary Substitutions
              </h2>
              <div className="divide-y divide-white/10 text-sm">
                {match.substitutions.map((sub, i) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4">
                    <span className="text-[#D0D7DF]">
                      {getPlayerById(sub.playerOutId)?.name ?? sub.playerOutId} →{' '}
                      <strong className="text-white">
                        {getPlayerById(sub.playerInId)?.name ?? sub.playerInId}
                      </strong>
                    </span>
                    <span className="text-xs text-[#AAB3BD] tabular-nums">
                      {getTeamById(sub.teamId)?.name ?? sub.teamId}
                      {sub.scoreAtEvent ? ` · ${sub.scoreAtEvent}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {match.progression && match.progression.length > 0 && (
            <section className="border border-white/10 bg-[#17212B] p-7">
              <h2 className="font-display text-2xl font-bold tracking-[0.08em] text-white uppercase mb-5">
                Match Progression
              </h2>
              <div className="divide-y divide-white/10 text-sm tabular-nums">
                {match.progression.map((pt, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <span className="text-[#AAB3BD]">{pt.checkpoint}</span>
                    <span className="font-display text-lg text-white">
                      {pt.teamAScore} – {pt.teamBScore}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
