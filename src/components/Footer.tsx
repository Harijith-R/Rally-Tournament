import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

interface FooterProps {
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  return (
    <footer className="border-t border-white/10 bg-[#0C131A]">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <Link
              to="/"
              className="font-display text-3xl font-bold tracking-[0.14em] text-white inline-flex items-center gap-2"
            >
              <span>RALLY</span>
              <span className="text-[#A3E635]">2026</span>
            </Link>
            <p className="mt-3 font-display text-sm tracking-[0.2em] text-[#C0C0C0] uppercase">
              EVERY POINT MATTERS.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#AAB3BD]">
              Official digital home of RALLY TOURNAMENT 2026 — a premier Men&apos;s Doubles
              badminton championship uniting six teams and sixty-eight players across two
              competitive groups in a 100-point elimination format.
            </p>
            <button
              type="button"
              onClick={onReplayIntro}
              className="mt-6 inline-flex items-center gap-2 border border-white/15 bg-[#17212B] px-4 py-2.5 text-xs font-medium tracking-wider text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Replay Cinematic Intro</span>
            </button>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm tracking-[0.16em] text-white uppercase mb-4">
                Championship
              </h3>
              <ul className="space-y-2.5 text-sm text-[#AAB3BD]">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/teams" className="hover:text-white transition-colors">
                    Teams
                  </Link>
                </li>
                <li>
                  <Link to="/players" className="hover:text-white transition-colors">
                    Players Directory
                  </Link>
                </li>
                <li>
                  <Link to="/champions" className="hover:text-white transition-colors">
                    Champions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-[0.16em] text-white uppercase mb-4">
                Competition
              </h3>
              <ul className="space-y-2.5 text-sm text-[#AAB3BD]">
                <li>
                  <Link to="/fixtures" className="hover:text-white transition-colors">
                    Fixtures
                  </Link>
                </li>
                <li>
                  <Link to="/results" className="hover:text-white transition-colors">
                    Results
                  </Link>
                </li>
                <li>
                  <Link to="/standings" className="hover:text-white transition-colors">
                    Standings
                  </Link>
                </li>
                <li>
                  <Link to="/rules" className="hover:text-white transition-colors">
                    Official Rules
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-sm tracking-[0.16em] text-white uppercase mb-4">
              Tournament Format
            </h3>
            <dl className="space-y-2.5 text-sm text-[#AAB3BD]">
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt>Discipline</dt>
                <dd className="text-white font-medium">Men&apos;s Doubles</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt>Structure</dt>
                <dd className="text-white font-medium tabular-nums">6 Teams · 2 Groups</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt>Roster</dt>
                <dd className="text-white font-medium tabular-nums">68 Players</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Match Target</dt>
                <dd className="text-[#A3E635] font-medium tabular-nums">100 Points</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#AAB3BD]">
          <p>© 2026 RALLY TOURNAMENT 2026. All rights reserved.</p>
          <p className="tabular-nums">Group A (34 Players) · Group B (34 Players) · Elimination at 25 / 50 / 75</p>
        </div>
      </div>
    </footer>
  );
};
