// ===== 龙虎斗模拟引擎 =====

import { createShuffledDeck, getCardValue, calculatePayout } from './DragonTigerEngine';
import type { DragonTigerBet, DragonTigerResult } from '../types';

export interface DTSimulationResult {
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
    resultDistribution: Record<DragonTigerResult, number>;
}

interface DTSimulationConfig {
    rounds: number;
    initialBalance: number;
    bets: DragonTigerBet[];
    useMartingale?: boolean;
}

export const runDragonTigerSimulation = (config: DTSimulationConfig): DTSimulationResult => {
    const { rounds, initialBalance, bets, useMartingale = false } = config;

    let balance = initialBalance;
    let wins = 0, losses = 0;
    let totalWagered = 0, totalReturned = 0;
    let consecutiveLosses = 0, maxConsecutiveLosses = 0;
    let consecutiveWins = 0, maxConsecutiveWins = 0;
    let multiplier = 1;
    const balanceHistory: number[] = [balance];
    const resultDistribution: Record<DragonTigerResult, number> = { dragon: 0, tiger: 0, tie: 0 };

    for (let i = 0; i < rounds; i++) {
        const deck = createShuffledDeck();
        const dragonCard = deck[0];
        const tigerCard = deck[1];
        const dv = getCardValue(dragonCard);
        const tv = getCardValue(tigerCard);
        const result: DragonTigerResult = dv > tv ? 'dragon' : tv > dv ? 'tiger' : 'tie';
        resultDistribution[result]++;

        let roundWagered = 0, roundReturned = 0;
        for (const baseBet of bets) {
            const bet: DragonTigerBet = { ...baseBet, amount: useMartingale ? baseBet.amount * multiplier : baseBet.amount };
            if (bet.amount > balance) continue;
            roundWagered += bet.amount;
            balance -= bet.amount;
            const payout = calculatePayout(bet, result);
            roundReturned += payout;
            balance += payout;
        }

        totalWagered += roundWagered;
        totalReturned += roundReturned;

        if (roundReturned > roundWagered) {
            wins++; consecutiveLosses = 0;
            consecutiveWins++;
            if (consecutiveWins > maxConsecutiveWins) maxConsecutiveWins = consecutiveWins;
            if (useMartingale) multiplier = 1;
        } else {
            losses++; consecutiveWins = 0;
            consecutiveLosses++;
            if (useMartingale) multiplier *= 2;
            if (consecutiveLosses > maxConsecutiveLosses) maxConsecutiveLosses = consecutiveLosses;
        }
        balanceHistory.push(balance);
    }

    return {
        totalRounds: rounds, wins, losses, totalWagered, totalReturned,
        netProfit: totalReturned - totalWagered,
        rtp: totalWagered > 0 ? (totalReturned / totalWagered) * 100 : 0,
        maxConsecutiveWins, maxConsecutiveLosses, balanceHistory, resultDistribution,
    };
};
