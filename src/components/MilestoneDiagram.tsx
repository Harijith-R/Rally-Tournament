import React from 'react';
import type { RuleMilestone } from '../types/tournament';

interface MilestoneDiagramProps {
  milestones: RuleMilestone[];
  compact?: boolean;
}

export const MilestoneDiagram: React.FC<MilestoneDiagramProps> = ({
  milestones,
  compact = false,
}) => {
  return (
    <div className="w-full">
      {/* Continuous 0 -> 100 Championship Track */}
      <div className="relative mb-8 hidden md:block">
        <div className="flex items-center justify-between text-xs text-[#AAB3BD] mb-3 tabular-nums">
          <span>00 PTS · MATCH START</span>
          <span>25 PTS</span>
          <span>50 PTS</span>
          <span>75 PTS</span>
          <span className="text-[#A3E635] font-medium">100 PTS · VICTORY TARGET</span>
        </div>
        <div className="relative h-[2px] w-full bg-white/15">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#C0C0C0]/40 via-[#C0C0C0]/70 to-[#A3E635]" />
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              style={{ left: `${mark}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <div
                className={
                  mark === 100
                    ? 'h-4 w-4 border-2 border-[#A3E635] bg-[#101820]'
                    : mark === 0
                      ? 'h-2.5 w-2.5 bg-[#AAB3BD]'
                      : 'h-3.5 w-3.5 rotate-45 border border-[#A3E635] bg-[#101820]'
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Four Milestone Cards */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} gap-5`}>
        {milestones.map((m) => {
          const isVictory = m.type === 'victory';
          return (
            <div
              key={m.points}
              className={`relative border p-6 transition-colors duration-200 ${
                isVictory
                  ? 'border-[#A3E635]/50 bg-[#17212B]'
                  : 'border-white/10 bg-[#17212B]/80 hover:border-white/25'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                <span
                  className={`font-display text-5xl font-bold leading-none tabular-nums ${
                    isVictory ? 'text-[#A3E635]' : 'text-white'
                  }`}
                >
                  {m.points}
                </span>
                <span className="text-xs tracking-wider text-[#AAB3BD] uppercase">
                  {isVictory ? 'Target' : 'Elimination'}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold tracking-wide text-white mb-2">
                {m.title}
              </h3>

              <p className="text-sm leading-relaxed text-[#AAB3BD]">
                {m.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
