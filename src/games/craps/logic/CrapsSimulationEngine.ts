// ===== 花旗骰模拟引擎 =====

import { rollCrapsDice, getDiceSum, evaluateComeOutRoll, evaluatePointRoll } from './CrapsEngine';
import type { CrapsBet } from '../types';

export interface CrapsSimulationResult {
    totalRounds: number;
    wins: number;
    losses: number;
    totalWagered: number;
    totalReturned: number;
    netProfit: number;
    rtp: number;
    maxWin: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
    balanceHistory: number[];
    sumDistribution: Record<number, number>;
}

interface CrapsSimulationConfig {
    rounds: number;
    initialBalance: number;
    bets: CrapsBet[];
    useMartingale?: boolean;
}

export const runCrapsSimulation = (config: CrapsSimulationConfig): CrapsSimulationResult => {
    const { rounds, initialBalance, bets, useMartingale = false } = config;

    let balance = initialBalance;
    let playedRounds = 0;
    let wins = 0, losses = 0;
    let totalWagered = 0, totalReturned = 0;
    let consecutiveLosses = 0, maxConsecutiveLosses = 0;
    let consecutiveWins = 0, maxConsecutiveWins = 0;
    let maxWin = 0;
    let multiplier = 1;
    const balanceHistory: number[] = [balance];
    const sumDistribution: Record<number, number> = {};
    for (let i = 2; i <= 12; i++) sumDistribution[i] = 0;

    for (let i = 0; i < rounds; i++) {
        if (balance <= 0) break;

        const scaledBets: CrapsBet[] = bets.map(baseBet => ({
            ...baseBet,
            amount: useMartingale ? baseBet.amount * multiplier : baseBet.amount,
        }));
        const hasAffordableBet = scaledBets.some(bet => bet.amount > 0 && bet.amount <= balance);
        if (!hasAffordableBet) break;

        // Come Out Roll
        const comeOutDice = rollCrapsDice();
        const comeOutSum = getDiceSum(comeOutDice);
        sumDistribution[comeOutSum]++;
        const comeOutResult = evaluateComeOutRoll(comeOutDice);

        let roundWagered = 0, roundReturned = 0;

        // 结算单轮下注 (field, any_seven, any_craps)
        for (const bet of scaledBets) {
            if (bet.amount > balance) continue;

            if (bet.type === 'field' || bet.type === 'any_seven' || bet.type === 'any_craps') {
                roundWagered += bet.amount;
                balance -= bet.amount;
                let payout = 0;
                if (bet.type === 'field') {
                    if (comeOutSum === 2 || comeOutSum === 12) payout = bet.amount * 3;
                    else if ([3, 4, 9, 10, 11].includes(comeOutSum)) payout = bet.amount * 2;
                } else if (bet.type === 'any_seven') {
                    if (comeOutSum === 7) payout = bet.amount * 5;
                } else if (bet.type === 'any_craps') {
                    if (comeOutSum === 2 || comeOutSum === 3 || comeOutSum === 12) payout = bet.amount * 8;
                }
                roundReturned += payout;
                balance += payout;
                continue;
            }

            // Pass/Don't Pass 多轮逻辑
            roundWagered += bet.amount;
            balance -= bet.amount;

            if (comeOutResult.type === 'natural') {
                // 7 or 11
                const payout = bet.type === 'pass_line' || bet.type === 'come' ? bet.amount * 2 : 0;
                roundReturned += payout;
                balance += payout;
            } else if (comeOutResult.type === 'craps') {
                // 2,3,12
                if (bet.type === 'dont_pass' || bet.type === 'dont_come') {
                    const payout = comeOutSum === 12 ? bet.amount : bet.amount * 2; // 12 = push
                    roundReturned += payout;
                    balance += payout;
                }
            } else {
                // Point set → 继续掷骰直到 Point 或 7
                const point = comeOutResult.point;
                let resolved = false;
                while (!resolved) {
                    const pointDice = rollCrapsDice();
                    const pointSum = getDiceSum(pointDice);
                    sumDistribution[pointSum] = (sumDistribution[pointSum] || 0) + 1;
                    const pointResult = evaluatePointRoll(pointDice, point);
                    if (pointResult.type === 'point_hit') {
                        const payout = bet.type === 'pass_line' || bet.type === 'come' ? bet.amount * 2 : 0;
                        roundReturned += payout;
                        balance += payout;
                        resolved = true;
                    } else if (pointResult.type === 'seven_out') {
                        const payout = bet.type === 'dont_pass' || bet.type === 'dont_come' ? bet.amount * 2 : 0;
                        roundReturned += payout;
                        balance += payout;
                        resolved = true;
                    }
                }
            }
        }

        totalWagered += roundWagered;
        totalReturned += roundReturned;
        if (roundWagered === 0) break;

        const roundProfit = roundReturned - roundWagered;

        if (roundProfit > 0) {
            wins++; consecutiveLosses = 0;
            consecutiveWins++;
            if (consecutiveWins > maxConsecutiveWins) maxConsecutiveWins = consecutiveWins;
            if (roundProfit > maxWin) maxWin = roundProfit;
            if (useMartingale) multiplier = 1;
        } else if (roundProfit < 0) {
            losses++; consecutiveWins = 0;
            consecutiveLosses++;
            if (useMartingale) multiplier *= 2;
            if (consecutiveLosses > maxConsecutiveLosses) maxConsecutiveLosses = consecutiveLosses;
        }
        balanceHistory.push(balance);
        playedRounds++;
    }

    return {
        totalRounds: playedRounds, wins, losses, totalWagered, totalReturned,
        netProfit: totalReturned - totalWagered,
        rtp: totalWagered > 0 ? (totalReturned / totalWagered) * 100 : 0,
        maxWin, maxConsecutiveWins, maxConsecutiveLosses, balanceHistory, sumDistribution,
    };
};
