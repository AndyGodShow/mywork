import { useEffect, useState, lazy, Suspense, useTransition } from 'react';
import { Lobby } from './components/Lobby/Lobby';
import { ErrorBoundary } from './components/ErrorBoundary';

const loadBaccaratGame = () => import('./games/baccarat/BaccaratGame');
const loadBlackjackGame = () => import('./games/blackjack/BlackjackGame');
const loadRouletteGame = () => import('./games/roulette/RouletteGame');
const loadSlotGame = () => import('./games/slots/SlotGame');
const loadSicBoGame = () => import('./games/sicbo/SicBoGame');
const loadDragonTigerGame = () => import('./games/dragontiger/DragonTigerGame');
const loadSanGongGame = () => import('./games/sangong/SanGongGame');
const loadCrapsGame = () => import('./games/craps/CrapsGame');

// 懒加载：只有进入对应游戏时才加载其代码
const BaccaratGame = lazy(() => loadBaccaratGame().then(m => ({ default: m.BaccaratGame })));
const BlackjackGame = lazy(() => loadBlackjackGame().then(m => ({ default: m.BlackjackGame })));
const RouletteGame = lazy(() => loadRouletteGame().then(m => ({ default: m.RouletteGame })));
const SlotGame = lazy(() => loadSlotGame().then(m => ({ default: m.SlotGame })));
const SicBoGame = lazy(() => loadSicBoGame().then(m => ({ default: m.SicBoGame })));
const DragonTigerGame = lazy(() => loadDragonTigerGame().then(m => ({ default: m.DragonTigerGame })));
const SanGongGame = lazy(() => loadSanGongGame().then(m => ({ default: m.SanGongGame })));
const CrapsGame = lazy(() => loadCrapsGame().then(m => ({ default: m.CrapsGame })));

import './App.css';

type Screen = 'LOBBY' | 'BACCARAT' | 'BLACKJACK' | 'ROULETTE' | 'SLOTS' | 'SICBO' | 'DRAGONTIGER' | 'SANGONG' | 'CRAPS';

const GAME_ID_TO_SCREEN: Record<string, Screen> = {
  baccarat: 'BACCARAT',
  blackjack: 'BLACKJACK',
  roulette: 'ROULETTE',
  slots: 'SLOTS',
  sicbo: 'SICBO',
  dragontiger: 'DRAGONTIGER',
  sangong: 'SANGONG',
  craps: 'CRAPS',
};

const GAME_PRELOADERS: Record<string, () => Promise<unknown>> = {
  baccarat: loadBaccaratGame,
  blackjack: loadBlackjackGame,
  roulette: loadRouletteGame,
  slots: loadSlotGame,
  sicbo: loadSicBoGame,
  dragontiger: loadDragonTigerGame,
  sangong: loadSanGongGame,
  craps: loadCrapsGame,
};

const GameLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#aaa',
    fontSize: '1.2rem',
    gap: '12px',
  }}>
    <span style={{ fontSize: '2rem', animation: 'pulse 1s infinite alternate' }}>🎲</span>
    加载中...
  </div>
);

function App() {
  const [screen, setScreen] = useState<Screen>('LOBBY');
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const preloadGame = (gameId: string) => {
    const preload = GAME_PRELOADERS[gameId];
    if (preload) {
      void preload();
    }
  };

  const handleSelectGame = (gameId: string) => {
    const target = GAME_ID_TO_SCREEN[gameId];
    if (!target) return;

    setPendingGameId(gameId);
    preloadGame(gameId);
    startTransition(() => {
      setScreen(target);
    });
  };

  const handleBackToLobby = () => {
    setPendingGameId(null);
    startTransition(() => {
      setScreen('LOBBY');
    });
  };

  useEffect(() => {
    const preloadAllGames = () => {
      Object.values(GAME_PRELOADERS).forEach((preload) => {
        void preload();
      });
    };

    if (typeof window === 'undefined') return undefined;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(() => preloadAllGames());
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(preloadAllGames, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {screen === 'LOBBY' && (
        <Lobby
          onSelectGame={handleSelectGame}
          onPreviewGame={preloadGame}
          pendingGameId={pendingGameId}
        />
      )}

      <ErrorBoundary fallbackMessage="游戏加载出错，请重试">
        <Suspense fallback={<GameLoadingFallback />}>
          {screen === 'BACCARAT' && <BaccaratGame onBackToLobby={handleBackToLobby} />}
          {screen === 'BLACKJACK' && <BlackjackGame onBackToLobby={handleBackToLobby} />}
          {screen === 'ROULETTE' && <RouletteGame onBackToLobby={handleBackToLobby} />}
          {screen === 'SLOTS' && <SlotGame onBackToLobby={handleBackToLobby} />}
          {screen === 'SICBO' && <SicBoGame onBackToLobby={handleBackToLobby} />}
          {screen === 'DRAGONTIGER' && <DragonTigerGame onBackToLobby={handleBackToLobby} />}
          {screen === 'SANGONG' && <SanGongGame onBackToLobby={handleBackToLobby} />}
          {screen === 'CRAPS' && <CrapsGame onBackToLobby={handleBackToLobby} />}
        </Suspense>
      </ErrorBoundary>

      <footer className="app-footer">
        <p>教育用途模拟器 - 请勿用于真实赌博</p>
      </footer>
    </div>
  );
}

export default App;
