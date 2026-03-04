// ===== 骰宝投注策略 =====

import type { SicBoBet } from '../types';

interface SicBoStrategy {
    name: string;
    description: string;
    getBets: (baseBet: number) => SicBoBet[];
}

/** 固定押大 */
const bigStrategy: SicBoStrategy = {
    name: '固定押大',
    description: '每轮固定押大（总和 11-17），赔率 1:1，赌场优势 2.78%',
    getBets: (baseBet: number) => [{ type: 'big', amount: baseBet }],
};

/** 固定押小 */
const smallStrategy: SicBoStrategy = {
    name: '固定押小',
    description: '每轮固定押小（总和 4-10），赔率 1:1，赌场优势 2.78%',
    getBets: (baseBet: number) => [{ type: 'small', amount: baseBet }],
};

/** 大小交替 */
const alternateStrategy: SicBoStrategy = {
    name: '大小交替',
    description: '大小轮流押注',
    getBets: (baseBet: number) => [
        { type: Math.random() > 0.5 ? 'big' : 'small', amount: baseBet },
    ],
};

/** 单骰策略：固定押某个数字 */
const singleNumberStrategy: SicBoStrategy = {
    name: '单骰策略',
    description: '固定押单个数字出现（默认数字6），出现1次赔1:1，2次赔2:1，3次赔12:1',
    getBets: (baseBet: number) => [{ type: 'single', amount: baseBet, value: 6 }],
};

/** 组合策略：大 + 单骰 */
const comboStrategy: SicBoStrategy = {
    name: '组合策略',
    description: '同时押大和单骰6，分散风险',
    getBets: (baseBet: number) => [
        { type: 'big', amount: baseBet },
        { type: 'single', amount: Math.floor(baseBet / 2), value: 6 },
    ],
};

/** 全部策略列表 */
export const ALL_STRATEGIES: SicBoStrategy[] = [
    bigStrategy,
    smallStrategy,
    alternateStrategy,
    singleNumberStrategy,
    comboStrategy,
];
