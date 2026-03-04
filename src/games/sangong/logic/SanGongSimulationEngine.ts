// ===== 三公模拟引擎 =====

import { createDeck, evaluateHand, compareHands, calculatePayout } from './SanGongEngine';
import type { SanGongBet } from '../types';

export interface SGSimulationResult {
    totalRounds: number;
    wins: number;
    losses: number;
    totalWagered: number;
    totalReturned: number;
    netProfit: number;
    rtp: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
    balanceHistory: number[];
    resultDistribution: Record<string, number>;
}

interface SGSimulationConfig {
    rounds: number;
    initialBalance: number;
    bets: SanGongBet[];
    useMartingale?: boolean;
}

export const runSanGongSimulation = (config: SGSimulationConfig): SGSimulationResult => {
    const { rounds, initialBalance, bets, useMartingale = false } = config;

    let balance = initialBalance;
    let playedRounds = 0;
    let wins = 0, losses = 0;
    let totalWagered = 0, totalReturned = 0;
    let consecutiveLosses = 0, maxConsecutiveLosses = 0;
    let consecutiveWins = 0, maxConsecutiveWins = 0;
    let multiplier = 1;
    const balanceHistory: number[] = [balance];
    const resultDistribution: Record<string, number> = { player_wins: 0, banker_wins: 0, tie: 0 };

    for (let i = 0; i < rounds; i++) {
        if (balance <= 0) break;

        const scaledBets: SanGongBet[] = bets.map(baseBet => ({
            ...baseBet,
            amount: useMartingale ? baseBet.amount * multiplier : baseBet.amount,
        }));
        const hasAffordableBet = scaledBets.some(bet => bet.amount > 0 && bet.amount <= balance);
        if (!hasAffordableBet) break;

        const deck = createDeck();
        const playerHand = evaluateHand([deck[0], deck[1], deck[2]]);
        const bankerHand = evaluateHand([deck[3], deck[4], deck[5]]);
        const cmp = compareHands(playerHand, bankerHand);
        const result: 'player_wins' | 'banker_wins' | 'tie' = cmp > 0 ? 'player_wins' : cmp < 0 ? 'banker_wins' : 'tie';
        resultDistribution[result]++;

        let roundWagered = 0, roundReturned = 0;
        for (const bet of scaledBets) {
            if (bet.amount > balance) continue;
            roundWagered += bet.amount;
            balance -= bet.amount;
            const payout = calculatePayout(bet, result);
            roundReturned += payout;
            balance += payout;
        }

        totalWagered += roundWagered;
        totalReturned += roundReturned;
        if (roundWagered === 0) break;

        const roundProfit = roundReturned - roundWagered;

        if (roundProfit > 0) {
            wins++; consecutiveLosses = 0;
            consecutiveWins++;
            if (consecutiveWins > maxConsecutiveWins) maxConsecutiveWins = consecutiveWins;
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
        maxConsecutiveWins, maxConsecutiveLosses, balanceHistory, resultDistribution,
    };
};
