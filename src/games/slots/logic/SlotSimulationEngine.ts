import { performSpin } from './SlotEngine';
import type { SlotStrategy } from './SlotStrategies';

interface SlotSimulationConfig {
    rounds: number;
    initialBalance: number;
    baseBetPerLine: number;
    activeLines: number;
    strategy: SlotStrategy;
}

export interface SlotSimulationResult {
    rounds: number;
    initialBalance: number;
    finalBalance: number;
    totalWagered: number;
    totalWon: number;
    netResult: number;
    rtp: number;            // 实际 RTP %
    maxBalance: number;
    minBalance: number;
    winCount: number;
    lossCount: number;
    winRate: number;        // 中奖率 %
    biggestWin: number;
    balanceHistory: number[];
}

export const runSlotSimulation = (config: SlotSimulationConfig): SlotSimulationResult => {
    const { rounds, initialBalance, baseBetPerLine, activeLines, strategy } = config;

    let balance = initialBalance;
    let totalWagered = 0;
    let totalWon = 0;
    let maxBalance = balance;
    let minBalance = balance;
    let winCount = 0;
    let lossCount = 0;
    let biggestWin = 0;
    let lastWin = 0;

    const balanceHistory: number[] = [balance];

    // 历史采样比例 — 不要存储太多点
    const sampleInterval = Math.max(1, Math.floor(rounds / 500));

    for (let i = 0; i < rounds; i++) {
        const betPerLine = strategy.getNextBet(balance, baseBetPerLine, lastWin);
        const totalBet = betPerLine * activeLines;

        // 余额不足则停止
        if (totalBet <= 0 || totalBet > balance) {
            break;
        }

        balance -= totalBet;
        totalWagered += totalBet;

        const result = performSpin(betPerLine, activeLines);
        balance += result.totalWin;
        totalWon += result.totalWin;
        lastWin = result.totalWin;

        if (result.totalWin > 0) {
            winCount++;
            if (result.totalWin > biggestWin) biggestWin = result.totalWin;
        } else {
            lossCount++;
        }

        if (balance > maxBalance) maxBalance = balance;
        if (balance < minBalance) minBalance = balance;

        if (i % sampleInterval === 0) {
            balanceHistory.push(balance);
        }
    }

    // 确保最后一个点也在历史中
    if (balanceHistory[balanceHistory.length - 1] !== balance) {
        balanceHistory.push(balance);
    }

    const totalRounds = winCount + lossCount;
    return {
        rounds: totalRounds,
        initialBalance,
        finalBalance: balance,
        totalWagered,
        totalWon,
        netResult: balance - initialBalance,
        rtp: totalWagered > 0 ? (totalWon / totalWagered) * 100 : 0,
        maxBalance,
        minBalance,
        winCount,
        lossCount,
        winRate: totalRounds > 0 ? (winCount / totalRounds) * 100 : 0,
        biggestWin,
        balanceHistory,
    };
};
