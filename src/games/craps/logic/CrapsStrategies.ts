// ===== 花旗骰策略 =====
import type { CrapsBet } from '../types';

interface CrapsStrategy {
    name: string;
    description: string;
    getBets: (baseBet: number) => CrapsBet[];
}

export const ALL_CRAPS_STRATEGIES: CrapsStrategy[] = [
    { name: 'Pass Line', description: '经典 Pass Line 下注，赌场优势仅 1.41%', getBets: (b) => [{ type: 'pass_line', amount: b }] },
    { name: "Don't Pass", description: "Don't Pass 下注，赌场优势 1.36%，略优于 Pass Line", getBets: (b) => [{ type: 'dont_pass', amount: b }] },
    { name: 'Field', description: 'Field 下注（单轮结算），赌场优势约 5.56%', getBets: (b) => [{ type: 'field', amount: b }] },
    { name: 'Any Seven', description: 'Any Seven 下注，赔率 4:1 但赌场优势高达 16.67%', getBets: (b) => [{ type: 'any_seven', amount: b }] },
    { name: 'Any Craps', description: 'Any Craps (2,3,12)，赔率 7:1，赌场优势 11.11%', getBets: (b) => [{ type: 'any_craps', amount: b }] },
];
