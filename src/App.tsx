import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { ChampionsPage } from './pages/ChampionsPage';
import { FixturesPage } from './pages/FixturesPage';
import { HomePage } from './pages/HomePage';
import { PlayersPage } from './pages/PlayersPage';
import { ResultDetailPage } from './pages/ResultDetailPage';
import { ResultsPage } from './pages/ResultsPage';
import { RulesPage } from './pages/RulesPage';
import { StandingsPage } from './pages/StandingsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { TeamsPage } from './pages/TeamsPage';

const CinematicIntro = lazy(() =>
  import('./components/three/CinematicIntro').then((m) => ({
    default: m.CinematicIntro,
  }))
);

const INTRO_SESSION_KEY = 'rally2026_intro_seen';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const { data, loading, error, reload } = useTournament();
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // Ignore storage restrictions in private contexts
    }
    setShowIntro(false);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setShowIntro(true);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#101820] flex flex-col items-center justify-center px-6 text-center">
        <div className="font-display text-4xl font-bold tracking-[0.16em] text-white">
          RALLY <span className="text-[#A3E635]">2026</span>
        </div>
        <div className="mt-4 h-[2px] w-44 bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-[#A3E635]" />
        </div>
        <p className="mt-4 text-xs tracking-[0.2em] text-[#AAB3BD] uppercase">
          Loading Official Championship Data
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#101820] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-[0.08em] text-white uppercase">
          Unable to Load Tournament Data
        </h1>
        <p className="mt-3 max-w-md text-sm text-[#AAB3BD]">
          {error ?? 'The official JSON tournament dataset could not be retrieved.'}
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-6 bg-[#A3E635] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#101820] uppercase"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#101820] text-white">
      <ScrollToTop />

      {/* Full-Screen Signature 3D Cinematic Opening */}
      {showIntro && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1118]">
              <div className="font-display text-4xl font-bold tracking-[0.16em] text-white">
                RALLY <span className="text-[#A3E635]">2026</span>
              </div>
              <p className="mt-3 text-xs tracking-[0.2em] text-[#AAB3BD] uppercase">
                Preparing 3D Arena Scene…
              </p>
            </div>
          }
        >
          <CinematicIntro
            onComplete={handleIntroComplete}
            trophyGlbUrl={data.tournament.assets?.trophyGlbUrl}
          />
        </Suspense>
      )}

      <Navbar onReplayIntro={handleReplayIntro} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onReplayIntro={handleReplayIntro} />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/fixtures" element={<FixturesPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/:matchId" element={<ResultDetailPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/champions" element={<ChampionsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <TournamentProvider>
        <AppShell />
      </TournamentProvider>
    </HashRouter>
  );
}
