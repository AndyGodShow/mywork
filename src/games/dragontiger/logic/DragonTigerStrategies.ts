// ===== 龙虎斗策略 =====

import type { DragonTigerBet } from '../types';

interface DTStrategy {
    name: string;
    description: string;
    getBets: (baseBet: number) => DragonTigerBet[];
}

export const ALL_DT_STRATEGIES: DTStrategy[] = [
    {
        name: '固定押龙',
        description: '每轮固定押龙，赔率 1:1，赌场优势约 3.73%',
        getBets: (b) => [{ type: 'dragon', amount: b }],
    },
    {
        name: '固定押虎',
        description: '每轮固定押虎，赔率 1:1，赌场优势约 3.73%',
        getBets: (b) => [{ type: 'tiger', amount: b }],
    },
    {
        name: '固定押和',
        description: '每轮固定押和，赔率 8:1，赌场优势高达 32.77%',
        getBets: (b) => [{ type: 'tie', amount: b }],
    },
    {
        name: '龙虎交替',
        description: '龙虎随机交替押注',
        getBets: (b) => [{ type: Math.random() > 0.5 ? 'dragon' : 'tiger', amount: b }],
    },
];
