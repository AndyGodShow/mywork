// ===== 骰宝核心游戏引擎 =====

import type { SicBoBet, DiceResult } from '../types';
import { TOTAL_PAYOUTS } from '../types';
import { getSecureRandomInt } from '../../../logic/Random';

/** 掷 3 颗骰子 */
export const rollDice = (): DiceResult => {
    return [
        getSecureRandomInt(6) + 1,
        getSecureRandomInt(6) + 1,
        getSecureRandomInt(6) + 1,
    ];
};

/** 计算点数总和 */
export const getDiceSum = (dice: DiceResult): number =>
    dice[0] + dice[1] + dice[2];

/** 判断是否围骰（三同号） */
const isTriple = (dice: DiceResult): boolean =>
    dice[0] === dice[1] && dice[1] === dice[2];

/** 判断是否有对子 */
const hasDouble = (dice: DiceResult, num: number): boolean => {
    const count = dice.filter(d => d === num).length;
    return count >= 2;
};

/** 统计某数字出现次数 */
const countNumber = (dice: DiceResult, num: number): number =>
    dice.filter(d => d === num).length;

/** 判断是否包含两骰组合 (num1 和 num2 都出现至少一次) */
const hasTwoDiceCombo = (dice: DiceResult, num1: number, num2: number): boolean => {
    return dice.includes(num1) && dice.includes(num2);
};

/**
 * 计算单次下注的赔付金额（含本金）
 * 返回 0 表示输掉，返回 > 0 表示赢得的总额（含本金）
 */
export const calculatePayout = (bet: SicBoBet, dice: DiceResult): number => {
    const sum = getDiceSum(dice);
    const triple = isTriple(dice);

    switch (bet.type) {
        case 'big':
            // 大：11-17，围骰除外
            return (!triple && sum >= 11 && sum <= 17) ? bet.amount * 2 : 0;

        case 'small':
            // 小：4-10，围骰除外
            return (!triple && sum >= 4 && sum <= 10) ? bet.amount * 2 : 0;

        case 'odd':
            // 单：总和为奇数，围骰除外
            return (!triple && sum % 2 !== 0) ? bet.amount * 2 : 0;

        case 'even':
            // 双：总和为偶数，围骰除外
            return (!triple && sum % 2 === 0) ? bet.amount * 2 : 0;

        case 'specific_triple':
            // 指定围骰：赔率 180:1
            return (triple && dice[0] === bet.value) ? bet.amount * 181 : 0;

        case 'any_triple':
            // 任意围骰：赔率 30:1
            return triple ? bet.amount * 31 : 0;

        case 'specific_double':
            // 指定双骰：赔率 10:1
            return (bet.value !== undefined && hasDouble(dice, bet.value)) ? bet.amount * 11 : 0;

        case 'two_dice_combo': {
            // 两骰组合：赔率 5:1
            if (bet.value === undefined) return 0;
            const num1 = Math.floor(bet.value / 10);
            const num2 = bet.value % 10;
            return hasTwoDiceCombo(dice, num1, num2) ? bet.amount * 6 : 0;
        }

        case 'total': {
            // 总和下注：赔率查表
            if (bet.value === undefined) return 0;
            // 围骰时总和为 3 或 18 不在赔率表中
            const payout = TOTAL_PAYOUTS[bet.value];
            if (!payout) return 0;
            return sum === bet.value ? bet.amount * (payout + 1) : 0;
        }

        case 'single': {
            // 单骰：出现1次 1:1，2次 2:1，3次 12:1
            if (bet.value === undefined) return 0;
            const count = countNumber(dice, bet.value);
            if (count === 0) return 0;
            if (count === 1) return bet.amount * 2;
            if (count === 2) return bet.amount * 3;
            return bet.amount * 13; // 3次 = 12:1 + 本金
        }

        default:
            return 0;
    }
};

