// ===== 花旗骰核心引擎 =====

import { getSecureRandomInt } from '../../../logic/Random';
import type { CrapsDice } from '../types';

/** 掷两颗骰子 */
export const rollCrapsDice = (): CrapsDice => [
    getSecureRandomInt(6) + 1,
    getSecureRandomInt(6) + 1,
];

/** 获取骰子总和 */
export const getDiceSum = (dice: CrapsDice): number => dice[0] + dice[1];

/** Come Out Roll 判定 */
type ComeOutResult =
    | { type: 'natural'; sum: number }          // 7 或 11 → Pass Line 赢
    | { type: 'craps'; sum: number }            // 2,3,12 → Pass Line 输
    | { type: 'point_set'; point: number };     // 4,5,6,8,9,10 → 设定 Point

export const evaluateComeOutRoll = (dice: CrapsDice): ComeOutResult => {
    const sum = getDiceSum(dice);
    if (sum === 7 || sum === 11) return { type: 'natural', sum };
    if (sum === 2 || sum === 3 || sum === 12) return { type: 'craps', sum };
    return { type: 'point_set', point: sum };
};

/** Point Roll 判定 */
type PointResult =
    | { type: 'point_hit' }      // 摇到 Point → Pass Line 赢
    | { type: 'seven_out' }      // 摇到 7 → Pass Line 输
    | { type: 'continue' };      // 继续摇

export const evaluatePointRoll = (dice: CrapsDice, point: number): PointResult => {
    const sum = getDiceSum(dice);
    if (sum === point) return { type: 'point_hit' };
    if (sum === 7) return { type: 'seven_out' };
    return { type: 'continue' };
};


