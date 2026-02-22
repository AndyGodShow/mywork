// ===== 骰宝模拟引擎 =====

import { rollDice, calculatePayout, getDiceSum } from './SicBoEngine';
import type { SicBoBet, DiceResult } from '../types';

export interface SicBoSimulationResult {
    totalRounds: number;
    wins: number;
    losses: number;
    totalWagered: number;
    totalReturned: number;
    netProfit: number;
    rtp: number; // 返还率 %
    maxWin: number;
    maxLoss: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
    balanceHistory: number[];
    /** 各下注类型的胜率统计 */
    betTypeStats: Record<string, { wins: number; total: number; profit: number }>;
    /** 总和分布 */
    sumDistribution: Record<number, number>;
}

interface SicBoSimulationConfig {
    rounds: number;
    initialBalance: number;
    bets: SicBoBet[];
    /** 是否使用马丁格尔策略 */
    useMartingale?: boolean;
    /** 止损金额 (余额低于此值停止) */
    stopLoss?: number;
    /** 止盈金额 (余额高于此值停止) */
    stopWin?: number;
}

export const runSicBoSimulation = (config: SicBoSimulationConfig): SicBoSimulationResult => {
    const {
        rounds,
        initialBalance,
        bets,
        useMartingale = false,
        stopLoss = 0,
        stopWin = Infinity,
    } = config;

    let balance = initialBalance;
    let wins = 0;
    let losses = 0;
    let totalWagered = 0;
    let totalReturned = 0;
    let maxWin = 0;
    let maxLoss = 0;
    let consecutiveLosses = 0;
    let maxConsecutiveLosses = 0;
    let consecutiveWins = 0;
    let maxConsecutiveWins = 0;
    let currentMultiplier = 1;

    const balanceHistory: number[] = [balance];
    const betTypeStats: Record<string, { wins: number; total: number; profit: number }> = {};
    const sumDistribution: Record<number, number> = {};

    // 初始化总和分布
    for (let s = 3; s <= 18; s++) {
        sumDistribution[s] = 0;
    }

    for (let i = 0; i < rounds; i++) {
        // 检查止损/止盈
        if (balance <= stopLoss || balance >= stopWin) break;

        const dice: DiceResult = rollDice();
        const sum = getDiceSum(dice);
        sumDistribution[sum] = (sumDistribution[sum] || 0) + 1;

        let roundWagered = 0;
        let roundReturned = 0;

        for (const baseBet of bets) {
            const bet: SicBoBet = {
                ...baseBet,
                amount: useMartingale ? baseBet.amount * currentMultiplier : baseBet.amount,
            };

            // 检查余额是否足够
            if (bet.amount > balance) continue;

            roundWagered += bet.amount;
            balance -= bet.amount;

            const payout = calculatePayout(bet, dice);
            roundReturned += payout;
            balance += payout;

            // 统计各下注类型
            const key = `${bet.type}${bet.value !== undefined ? `_${bet.value}` : ''}`;
            if (!betTypeStats[key]) {
                betTypeStats[key] = { wins: 0, total: 0, profit: 0 };
            }
            betTypeStats[key].total++;
            if (payout > 0) {
                betTypeStats[key].wins++;
            }
            betTypeStats[key].profit += payout - bet.amount;
        }

        totalWagered += roundWagered;
        totalReturned += roundReturned;

        const roundProfit = roundReturned - roundWagered;

        if (roundProfit > 0) {
            wins++;
            consecutiveLosses = 0;
            consecutiveWins++;
            if (consecutiveWins > maxConsecutiveWins) maxConsecutiveWins = consecutiveWins;
            if (useMartingale) currentMultiplier = 1;
            if (roundProfit > maxWin) maxWin = roundProfit;
        } else {
            losses++;
            consecutiveWins = 0;
            consecutiveLosses++;
            if (useMartingale) currentMultiplier *= 2;
            if (consecutiveLosses > maxConsecutiveLosses) {
                maxConsecutiveLosses = consecutiveLosses;
            }
            if (Math.abs(roundProfit) > maxLoss) maxLoss = Math.abs(roundProfit);
        }

        balanceHistory.push(balance);
    }

    return {
        totalRounds: balanceHistory.length - 1,
        wins,
        losses,
        totalWagered,
        totalReturned,
        netProfit: totalReturned - totalWagered,
        rtp: totalWagered > 0 ? (totalReturned / totalWagered) * 100 : 0,
        maxWin,
        maxLoss,
        maxConsecutiveWins,
        maxConsecutiveLosses,
        balanceHistory,
        betTypeStats,
        sumDistribution,
    };
};
