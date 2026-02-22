// ===== 骰宝（Sic Bo）类型定义 =====

/** 下注类型 */
export type SicBoBetType =
    | 'big'           // 大 (11-17, 围骰除外) 1:1
    | 'small'         // 小 (4-10, 围骰除外) 1:1
    | 'odd'           // 单 (围骰除外) 1:1
    | 'even'          // 双 (围骰除外) 1:1
    | 'specific_triple' // 指定围骰 180:1
    | 'any_triple'    // 任意围骰 30:1
    | 'specific_double' // 指定双骰 10:1
    | 'two_dice_combo'  // 两骰组合 5:1
    | 'total'         // 总和 (4-17) 赔率不等
    | 'single'        // 单骰 (出现1次1:1, 2次2:1, 3次12:1)
    ;

/** 单次下注 */
export interface SicBoBet {
    type: SicBoBetType;
    amount: number;
    /** 具体值：
     * - single/specific_triple/specific_double: 1-6
     * - total: 4-17
     * - two_dice_combo: 编码为 num1 * 10 + num2 (如 12=1和2)
     */
    value?: number;
}

/** 游戏阶段 */
export const SicBoPhase = {
    Betting: 'BETTING',
    Rolling: 'ROLLING',
    Result: 'RESULT',
} as const;

export type SicBoPhase = typeof SicBoPhase[keyof typeof SicBoPhase];

/** 骰子结果 */
export type DiceResult = [number, number, number];

/** 游戏状态 */
export interface SicBoGameState {
    phase: SicBoPhase;
    bets: SicBoBet[];
    dice: DiceResult | null;
    history: DiceResult[];
    message: string;
}

/** 赔率表：总和对应赔率 */
export const TOTAL_PAYOUTS: Record<number, number> = {
    4: 62, 5: 31, 6: 18, 7: 12, 8: 8,
    9: 7, 10: 6, 11: 6, 12: 6,
    13: 8, 14: 12, 15: 18, 16: 31, 17: 62,
};
