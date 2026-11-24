import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  padZero?: boolean;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  padZero = false,
  duration = 1.4,
  className = '',
}) => {
  const [display, setDisplay] = useState<number>(value);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || hasAnimatedRef.current) {
      setDisplay(value);
      return;
    }

    const node = elRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration,
            ease: 'power3.out',
            onUpdate: () => {
              setDisplay(Math.round(obj.val));
            },
            onComplete: () => {
              setDisplay(value);
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  const formatted = padZero && display < 10 ? `0${display}` : String(display);

  return (
    <span ref={elRef} className={`tabular-nums ${className}`}>
      {formatted}
    </span>
  );
};
