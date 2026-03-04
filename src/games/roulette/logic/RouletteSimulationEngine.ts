import { calculateRoulettePayout } from './RouletteEngine';
import type { RouletteStrategy } from './RouletteStrategies';
import { getSecureRandomInt } from '../../../logic/Random';

export interface RouletteSimulationResult {
    totalRounds: number;
    wins: number;
    losses: number;
    maxWinStreak: number;
    maxLossStreak: number;
    finalBalance: number;
    balanceHistory: number[];
    numberDistribution: Record<number, number>;
}

export const runRouletteSimulation = (
    rounds: number,
    strategy: RouletteStrategy,
    initialBalance: number = 10000
): RouletteSimulationResult => {
    let balance = initialBalance;
    let playedRounds = 0;
    strategy.reset();

    let wins = 0;
    let losses = 0;
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let lastWon: boolean | null = null;
    const balanceHistory: number[] = [initialBalance];
    const numberDistribution: Record<number, number> = {};

    // 初始化分布
    for (let n = 0; n <= 36; n++) {
        numberDistribution[n] = 0;
    }

    for (let i = 0; i < rounds; i++) {
        if (balance <= 0) break;

        // 1. 获取策略下注
        const bets = strategy.getBets(balance, lastWon);
        if (bets.length === 0) break;

        // 扣除下注金额
        const totalBetAmount = bets.reduce((sum, b) => sum + b.amount, 0);
        if (totalBetAmount > balance) break;
        balance -= totalBetAmount;

        // 2. 旋转轮盘
        const resultNum = getSecureRandomInt(37);
        numberDistribution[resultNum]++;

        // 3. 结算
        let totalWin = 0;
        bets.forEach(bet => {
            totalWin += calculateRoulettePayout(bet, resultNum);
        });

        balance += totalWin;
        const roundProfit = totalWin - totalBetAmount;
        const won = roundProfit > 0;
        const lost = roundProfit < 0;
        lastWon = won ? true : lost ? false : null;

        if (won) {
            wins++;
            currentStreak = currentStreak > 0 ? currentStreak + 1 : 1;
            maxWinStreak = Math.max(maxWinStreak, currentStreak);
        } else if (lost) {
            losses++;
            currentStreak = currentStreak < 0 ? currentStreak - 1 : -1;
            maxLossStreak = Math.max(maxLossStreak, Math.abs(currentStreak));
        }

        balanceHistory.push(balance);
        playedRounds++;
    }

    return {
        totalRounds: playedRounds,
        wins,
        losses,
        maxWinStreak,
        maxLossStreak,
        finalBalance: balance,
        balanceHistory,
        numberDistribution
    };
};
