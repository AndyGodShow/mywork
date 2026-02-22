import { Card } from './logic/Card';
import { GameResult } from './games/baccarat/logic/Rules';

export const GamePhase = {
    Betting: 'BETTING',
    Dealing: 'DEALING',
    PlayerThirdCard: 'PLAYER_THIRD_CARD',
    BankerThirdCard: 'BANKER_THIRD_CARD',
    Result: 'RESULT',
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

export type BetType = 'PLAYER' | 'BANKER' | 'TIE' | 'PLAYER_PAIR' | 'BANKER_PAIR';

export interface PlayerState {
    balance: number;
    currentBet: number; // Total bet amount for display
    bets: { [key in BetType]?: number }; // Detail bets
}

export interface RoundResult {
    winner: GameResult;
    playerScore: number;
    bankerScore: number;
    playerHand: Card[];
    bankerHand: Card[];
    timestamp: number;
}

export interface GameState {
    phase: GamePhase;
    playerHand: Card[];
    bankerHand: Card[];
    playerScore: number;
    bankerScore: number;
    history: RoundResult[];
    message: string;
}
