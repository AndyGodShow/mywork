import { Deck } from '../../../logic/Deck';
import {
    calculateScore,
    shouldDealerHit,
    isBust
} from './BlackjackRules';
import type {
    BlackjackAction
} from './BlackjackRules';
import type { BlackjackStrategy } from './BlackjackStrategies';

export interface BlackjackSimulationResult {
    totalRounds: number;
    playerWins: number;
    dealerWins: number;
    pushes: number;
    blackjacks: number;
    maxWinStreak: number;
    maxLossStreak: number;
    finalBalance: number;
    balanceHistory: number[];
}

export const runBlackjackSimulation = (
    rounds: number,
    strategy: BlackjackStrategy,
    initialBalance: number = 10000
): BlackjackSimulationResult => {
    const deck = new Deck(8);
    let balance = initialBalance;
    strategy.reset();

    let playerWins = 0;
    let dealerWins = 0;
    let pushes = 0;
    let blackjacks = 0;
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let lastResult: 'WIN' | 'LOSS' | 'PUSH' | null = null;
    const balanceHistory: number[] = [initialBalance];

    for (let i = 0; i < rounds; i++) {
        if (balance <= 0) break;

        if (deck.shouldReshuffle()) {
            deck.reset();
        }

        const bet = strategy.getBet(balance, lastResult);
        balance -= bet;

        // Deal
        const pCards = [deck.draw()!, deck.draw()!];
        const dCards = [deck.draw()!, deck.draw()!];

        let pScore = calculateScore(pCards).score;
        let dScore = calculateScore(dCards).score;

        // Check for Blackjacks
        const pBJ = pScore === 21;
        const dBJ = dScore === 21;

        if (pBJ || dBJ) {
            if (pBJ && dBJ) {
                balance += bet; // Push
                pushes++;
                lastResult = 'PUSH';
            } else if (pBJ) {
                balance += bet * 2.5; // 3:2 Payout
                playerWins++;
                blackjacks++;
                lastResult = 'WIN';
            } else {
                dealerWins++;
                lastResult = 'LOSS';
            }
        } else {
            // Player Turn
            let pBust = false;
            let action: BlackjackAction = 'HIT';

            while (pScore < 21) {
                const { isSoft } = calculateScore(pCards);
                action = strategy.getAction(pScore, dCards[0], pCards.length, isSoft);

                if (action === 'HIT') {
                    pCards.push(deck.draw()!);
                    pScore = calculateScore(pCards).score;
                } else if (action === 'DOUBLE') {
                    if (balance >= bet) {
                        balance -= bet;
                        pCards.push(deck.draw()!);
                        pScore = calculateScore(pCards).score;
                        break;
                    } else {
                        // Not enough balance, fallback to HIT
                        pCards.push(deck.draw()!);
                        pScore = calculateScore(pCards).score;
                    }
                } else {
                    break; // STAND
                }

                if (isBust(pCards)) {
                    pBust = true;
                    break;
                }
            }

            if (pBust) {
                dealerWins++;
                lastResult = 'LOSS';
            } else {
                // Dealer Turn
                while (shouldDealerHit(dCards)) {
                    dCards.push(deck.draw()!);
                }
                dScore = calculateScore(dCards).score;

                if (isBust(dCards) || pScore > dScore) {
                    // Win
                    const winAmt = action === 'DOUBLE' ? bet * 4 : bet * 2;
                    balance += winAmt;
                    playerWins++;
                    lastResult = 'WIN';
                } else if (pScore < dScore) {
                    dealerWins++;
                    lastResult = 'LOSS';
                } else {
                    const pushAmt = action === 'DOUBLE' ? bet * 2 : bet;
                    balance += pushAmt;
                    pushes++;
                    lastResult = 'PUSH';
                }
            }
        }

        // Stats
        if (lastResult === 'WIN') {
            currentStreak = currentStreak > 0 ? currentStreak + 1 : 1;
            maxWinStreak = Math.max(maxWinStreak, currentStreak);
        } else if (lastResult === 'LOSS') {
            currentStreak = currentStreak < 0 ? currentStreak - 1 : -1;
            maxLossStreak = Math.max(maxLossStreak, Math.abs(currentStreak));
        }

        balanceHistory.push(balance);
    }

    return {
        totalRounds: rounds,
        playerWins,
        dealerWins,
        pushes,
        blackjacks,
        maxWinStreak,
        maxLossStreak,
        finalBalance: balance,
        balanceHistory
    };
};
