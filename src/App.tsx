import { useState, lazy, Suspense } from 'react';
import { Lobby } from './components/Lobby/Lobby';
import { ErrorBoundary } from './components/ErrorBoundary';

// 懒加载：只有进入对应游戏时才加载其代码
const BaccaratGame = lazy(() => import('./games/baccarat/BaccaratGame').then(m => ({ default: m.BaccaratGame })));
const BlackjackGame = lazy(() => import('./games/blackjack/BlackjackGame').then(m => ({ default: m.BlackjackGame })));
const RouletteGame = lazy(() => import('./games/roulette/RouletteGame').then(m => ({ default: m.RouletteGame })));
const SlotGame = lazy(() => import('./games/slots/SlotGame').then(m => ({ default: m.SlotGame })));
const SicBoGame = lazy(() => import('./games/sicbo/SicBoGame').then(m => ({ default: m.SicBoGame })));
const DragonTigerGame = lazy(() => import('./games/dragontiger/DragonTigerGame').then(m => ({ default: m.DragonTigerGame })));
const SanGongGame = lazy(() => import('./games/sangong/SanGongGame').then(m => ({ default: m.SanGongGame })));
const CrapsGame = lazy(() => import('./games/craps/CrapsGame').then(m => ({ default: m.CrapsGame })));

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

  const handleSelectGame = (gameId: string) => {
    const target = GAME_ID_TO_SCREEN[gameId];
    if (target) setScreen(target);
  };

  const handleBackToLobby = () => setScreen('LOBBY');

  return (
    <div className="app-container">
      {screen === 'LOBBY' && <Lobby onSelectGame={handleSelectGame} />}

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
