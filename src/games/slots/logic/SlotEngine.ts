import type { SlotSymbol, PaylineResult, SpinResult } from '../types';
import { SYMBOL_WEIGHTS, PAYTABLE, PAYLINE_PATTERNS, REELS, ROWS } from '../types';

import { pickRandom } from '../../../logic/Random';

// ===== 符号生成 =====

// 构建权重池
const buildWeightedPool = (): SlotSymbol[] => {
    const pool: SlotSymbol[] = [];
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
        for (let i = 0; i < weight; i++) {
            pool.push(symbol as SlotSymbol);
        }
    }
    return pool;
};

const WEIGHTED_POOL = buildWeightedPool();

/** 随机选取一个符号 (使用加密安全随机数) */
const randomSymbol = (): SlotSymbol => {
    return pickRandom(WEIGHTED_POOL);
};

/** 生成 5×3 的符号矩阵 (reels[col][row]) */
export const generateReels = (): SlotSymbol[][] => {
    const reels: SlotSymbol[][] = [];
    for (let col = 0; col < REELS; col++) {
        const reel: SlotSymbol[] = [];
        for (let row = 0; row < ROWS; row++) {
            reel.push(randomSymbol());
        }
        reels.push(reel);
    }
    return reels;
};

// ===== 赔付检测 =====

/**
 * 检查单条赔付线上的连续匹配
 * 从左至右，WILD 可替代任意符号
 */
const checkPayline = (
    reels: SlotSymbol[][],
    pattern: number[],
    lineIndex: number,
    betPerLine: number
): PaylineResult | null => {
    // 获取该赔付线上的 5 个符号
    const symbols: SlotSymbol[] = pattern.map((row, col) => reels[col][row]);

    // 找到第一个非 WILD 符号作为基准
    let baseSymbol: SlotSymbol | null = null;
    for (const s of symbols) {
        if (s !== 'wild') {
            baseSymbol = s;
            break;
        }
    }

    // 全是 WILD 的情况
    if (baseSymbol === null) {
        baseSymbol = 'wild';
    }

    // 从左到右计算连续匹配数量
    let count = 0;
    for (const s of symbols) {
        if (s === baseSymbol || s === 'wild') {
            count++;
        } else {
            break;
        }
    }

    // 至少 3 连才有赔付
    if (count < 3) return null;

    const payIndex = count - 3; // 0=3连, 1=4连, 2=5连
    const multiplier = PAYTABLE[baseSymbol][payIndex];
    const payout = betPerLine * multiplier;

    return {
        lineIndex,
        symbol: baseSymbol,
        count,
        payout,
        positions: pattern,
    };
};

/**
 * 对所有激活的赔付线进行检测
 */
export const evaluateSpin = (
    reels: SlotSymbol[][],
    betPerLine: number,
    activeLines: number
): SpinResult => {
    const paylines: PaylineResult[] = [];
    let totalWin = 0;

    for (let i = 0; i < activeLines; i++) {
        const result = checkPayline(reels, PAYLINE_PATTERNS[i], i, betPerLine);
        if (result) {
            paylines.push(result);
            totalWin += result.payout;
        }
    }

    return { reels, paylines, totalWin };
};

/**
 * 执行一次完整的旋转：生成结果 + 计算赔付
 */
export const performSpin = (betPerLine: number, activeLines: number): SpinResult => {
    const reels = generateReels();
    return evaluateSpin(reels, betPerLine, activeLines);
};
