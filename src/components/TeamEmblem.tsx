import React from 'react';
import type { EmblemVariant } from '../types/tournament';

interface TeamEmblemProps {
  variant: EmblemVariant;
  color: string;
  number: number;
  size?: number;
  className?: string;
}

export const TeamEmblem: React.FC<TeamEmblemProps> = ({
  variant,
  color,
  number,
  size = 56,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Subtle geometric championship outer frame */}
      {variant === 'chevron' && (
        <>
          <polygon
            points="32,4 56,16 52,48 32,60 12,48 8,16"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <polyline
            points="18,22 32,12 46,22"
            stroke="#C0C0C0"
            strokeWidth="1.5"
            fill="none"
          />
          <polyline
            points="18,44 32,52 46,44"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </>
      )}

      {variant === 'shield' && (
        <>
          <path
            d="M32 4L55 12V33C55 46.5 45.2 55.6 32 60C18.8 55.6 9 46.5 9 33V12L32 4Z"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M32 10L49 16V32.5C49 42.8 41.8 50 32 53.6C22.2 50 15 42.8 15 32.5V16L32 10Z"
            stroke="#C0C0C0"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        </>
      )}

      {variant === 'diamond' && (
        <>
          <polygon
            points="32,4 58,32 32,60 6,32"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <polygon
            points="32,12 50,32 32,52 14,32"
            stroke="#C0C0C0"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            fill="none"
          />
        </>
      )}

      {variant === 'crest' && (
        <>
          <path
            d="M14 8H50L56 22L48 52L32 60L16 52L8 22L14 8Z"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <line x1="18" y1="16" x2="46" y2="16" stroke={color} strokeWidth="2" />
          <line x1="22" y1="48" x2="42" y2="48" stroke="#C0C0C0" strokeOpacity="0.6" strokeWidth="1.2" />
        </>
      )}

      {variant === 'wings' && (
        <>
          <polygon
            points="32,5 57,18 49,49 32,59 15,49 7,18"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <path d="M13 24L24 30M51 24L40 30" stroke="#C0C0C0" strokeWidth="1.5" />
          <path d="M16 38L24 34M48 38L40 34" stroke={color} strokeWidth="1.5" />
        </>
      )}

      {variant === 'prism' && (
        <>
          <polygon
            points="20,6 44,6 58,32 44,58 20,58 6,32"
            fill="#101820"
            stroke={color}
            strokeWidth="2"
          />
          <polygon
            points="23,12 41,12 51,32 41,52 23,52 13,32"
            stroke="#C0C0C0"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            fill="none"
          />
        </>
      )}

      <text
        x="32"
        y="39"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Oswald, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="1"
      >
        0{number}
      </text>
    </svg>
  );
};
