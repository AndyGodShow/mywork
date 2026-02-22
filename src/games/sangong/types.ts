// ===== 三公（San Gong）类型定义 =====

import { Card } from '../../logic/Card';



/** 下注类型 */
export type SanGongBetType = 'player_wins' | 'banker_wins' | 'tie';

/** 单次下注 */
export interface SanGongBet {
    type: SanGongBetType;
    amount: number;
}

/** 游戏阶段 */
export const SanGongPhase = {
    Betting: 'BETTING',
    Dealing: 'DEALING',
    Result: 'RESULT',
} as const;
export type SanGongPhase = typeof SanGongPhase[keyof typeof SanGongPhase];

/** 手牌信息 */
export interface SanGongHand {
    cards: Card[];
    points: number;
    isSanGong: boolean;
    handName: string;
}

/** 游戏状态 */
export interface SanGongGameState {
    phase: SanGongPhase;
    bets: SanGongBet[];
    playerHand: SanGongHand | null;
    bankerHand: SanGongHand | null;
    result: 'player_wins' | 'banker_wins' | 'tie' | null;
    history: ('player_wins' | 'banker_wins' | 'tie')[];
    message: string;
}
