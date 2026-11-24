import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Play, X } from 'lucide-react';

interface NavbarProps {
  onReplayIntro: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/teams', label: 'Teams' },
  { to: '/players', label: 'Players' },
  { to: '/fixtures', label: 'Fixtures' },
  { to: '/results', label: 'Results' },
  { to: '/standings', label: 'Standings' },
  { to: '/rules', label: 'Rules' },
  { to: '/champions', label: 'Champions' },
];

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
          scrolled || mobileOpen
            ? 'bg-[#101820]/95 border-b border-white/10'
            : 'bg-gradient-to-b from-[#101820]/85 via-[#101820]/40 to-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 lg:h-[72px] max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-[0.12em] text-white whitespace-nowrap shrink-0 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
          >
            <span>RALLY</span>
            <span className="text-[#A3E635]">2026</span>
          </Link>

          {/* Zone 2: Clean Typography Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] ${
                    isActive
                      ? 'text-white'
                      : 'text-[#AAB3BD] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#A3E635] transition-transform duration-200 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single Subtle Primary Utility / Mobile Menu Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onReplayIntro}
              className="hidden lg:inline-flex items-center gap-2 border border-white/15 bg-[#17212B]/80 px-3.5 py-2 text-xs font-medium tracking-wider text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Watch Intro</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-[#17212B]/80 text-white hover:border-[#A3E635] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/75"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute top-16 right-0 bottom-0 w-full max-w-xs border-l border-white/10 bg-[#101820] px-6 py-8 flex flex-col justify-between transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3.5 border-b border-white/10 font-display text-2xl tracking-wider transition-colors ${
                    isActive ? 'text-[#A3E635]' : 'text-white hover:text-[#A3E635]'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onReplayIntro();
              }}
              className="w-full inline-flex items-center justify-center gap-2 border border-[#A3E635]/60 bg-[#17212B] px-4 py-3 text-xs font-semibold tracking-widest text-[#A3E635] uppercase hover:bg-[#A3E635] hover:text-[#101820] transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Replay 3D Intro</span>
            </button>
            <p className="mt-4 text-xs text-[#AAB3BD]">
              RALLY TOURNAMENT 2026 · Men&apos;s Doubles Championship
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};
