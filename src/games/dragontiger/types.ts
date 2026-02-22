// ===== 龙虎斗（Dragon Tiger）类型定义 =====

import { Card } from '../../logic/Card';

/** 下注类型 */
export type DragonTigerBetType =
    | 'dragon'    // 龙 1:1
    | 'tiger'     // 虎 1:1
    | 'tie'       // 和 8:1
    ;

/** 单次下注 */
export interface DragonTigerBet {
    type: DragonTigerBetType;
    amount: number;
}

/** 游戏阶段 */
export const DragonTigerPhase = {
    Betting: 'BETTING',
    Dealing: 'DEALING',
    Result: 'RESULT',
} as const;

export type DragonTigerPhase = typeof DragonTigerPhase[keyof typeof DragonTigerPhase];

/** 游戏结果 */
export type DragonTigerResult = 'dragon' | 'tiger' | 'tie';

/** 游戏状态 */
export interface DragonTigerGameState {
    phase: DragonTigerPhase;
    bets: DragonTigerBet[];
    dragonCard: Card | null;
    tigerCard: Card | null;
    result: DragonTigerResult | null;
    history: DragonTigerResult[];
    message: string;
}
