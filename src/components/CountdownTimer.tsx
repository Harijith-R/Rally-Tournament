import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  /** ISO 8601 date string or Date object representing championship start */
  targetDate: string | Date;
  label?: string;
  className?: string;
}

interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
}

function calculateTimeRemaining(targetTimestamp: number): TimeRemaining {
  const diff = targetTimestamp - Date.now();
  if (Number.isNaN(targetTimestamp) || diff <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isStarted: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isStarted: false,
  };
}

function padUnit(value: number): string {
  return String(value).padStart(2, '0');
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = 'CHAMPIONSHIP COUNTDOWN',
  className = '',
}) => {
  const targetTimestamp = useMemo(() => {
    const parsed = targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }, [targetDate]);

  const formattedDate = useMemo(() => {
    const dateObj = new Date(targetTimestamp);
    if (Number.isNaN(dateObj.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
      .format(dateObj)
      .toUpperCase();
  }, [targetTimestamp]);

  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetTimestamp)
  );

  useEffect(() => {
    setRemaining(calculateTimeRemaining(targetTimestamp));

    const intervalId = window.setInterval(() => {
      setRemaining(calculateTimeRemaining(targetTimestamp));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetTimestamp]);

  const segments = [
    { unit: 'DAYS', value: padUnit(remaining.days), accent: false },
    { unit: 'HRS', value: padUnit(remaining.hours), accent: false },
    { unit: 'MIN', value: padUnit(remaining.minutes), accent: false },
    { unit: 'SEC', value: padUnit(remaining.seconds), accent: true },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={
        remaining.isStarted
          ? 'RALLY 2026 Championship is underway'
          : `Time remaining until RALLY 2026 starts: ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`
      }
      className={`relative border border-white/15 bg-[#101820]/90 ${className}`}
    >
      {/* Top championship accent hairline */}
      <div className="h-[2px] w-full bg-[#A3E635]" aria-hidden="true" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#C0C0C0] uppercase">
          <Clock className="h-3.5 w-3.5 text-[#A3E635]" aria-hidden="true" />
          <span>{label}</span>
        </div>
        {formattedDate && (
          <span className="text-[11px] font-medium tracking-[0.16em] text-[#A3E635] uppercase tabular-nums">
            {remaining.isStarted ? 'LIVE NOW' : formattedDate}
          </span>
        )}
      </div>

      {/* Time grid or live state */}
      {remaining.isStarted ? (
        <div className="px-5 py-6 text-center">
          <p className="font-display text-2xl sm:text-3xl font-bold tracking-[0.12em] text-[#A3E635] uppercase">
            CHAMPIONSHIP UNDERWAY
          </p>
          <p className="mt-1 text-xs tracking-[0.14em] text-[#AAB3BD] uppercase">
            First serve has commenced · Every point matters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 divide-x divide-white/10">
          {segments.map((seg) => (
            <div key={seg.unit} className="px-3 py-5 sm:px-4 sm:py-6 text-center">
              <div
                className={`font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-none tracking-[0.04em] tabular-nums ${
                  seg.accent ? 'text-[#A3E635]' : 'text-white'
                }`}
              >
                {seg.value}
              </div>
              <div className="mt-2.5 text-[10px] font-semibold tracking-[0.22em] text-[#AAB3BD] uppercase">
                {seg.unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
