import { useState } from 'react';
import { Lobby } from './components/Lobby/Lobby';
import { BaccaratGame } from './games/baccarat/BaccaratGame';
import { BlackjackGame } from './games/blackjack/BlackjackGame';
import { RouletteGame } from './games/roulette/RouletteGame';
import { SlotGame } from './games/slots/SlotGame';
import { SicBoGame } from './games/sicbo/SicBoGame';
import { DragonTigerGame } from './games/dragontiger/DragonTigerGame';
import { SanGongGame } from './games/sangong/SanGongGame';
import { CrapsGame } from './games/craps/CrapsGame';

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
      {screen === 'BACCARAT' && <BaccaratGame onBackToLobby={handleBackToLobby} />}
      {screen === 'BLACKJACK' && <BlackjackGame onBackToLobby={handleBackToLobby} />}
      {screen === 'ROULETTE' && <RouletteGame onBackToLobby={handleBackToLobby} />}
      {screen === 'SLOTS' && <SlotGame onBackToLobby={handleBackToLobby} />}
      {screen === 'SICBO' && <SicBoGame onBackToLobby={handleBackToLobby} />}
      {screen === 'DRAGONTIGER' && <DragonTigerGame onBackToLobby={handleBackToLobby} />}
      {screen === 'SANGONG' && <SanGongGame onBackToLobby={handleBackToLobby} />}
      {screen === 'CRAPS' && <CrapsGame onBackToLobby={handleBackToLobby} />}


      <footer className="app-footer">
        <p>教育用途模拟器 - 请勿用于真实赌博</p>
      </footer>
    </div>
  );
}

export default App;
