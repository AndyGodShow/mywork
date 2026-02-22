
import { Deck } from '../../../logic/Deck';
import { determineWinner, getBankerThirdCardAction, getPlayerThirdCardAction, isNatural, GameResult } from './Rules';
import type { Hand } from './Rules';
import type { BettingStrategy, Bet } from './Strategies';

export interface SimulationResult {
    totalRounds: number;
    playerWins: number;
    bankerWins: number;
    ties: number;
    maxWinStreak: number;
    maxLossStreak: number;
    finalBalance: number;
    history: ('P' | 'B' | 'T')[];
    balanceHistory: number[];
}

export const runSimulation = (rounds: number, strategy: BettingStrategy, initialBalance: number = 10000): SimulationResult => {
    const deck = new Deck(8);
    let balance = initialBalance;
    strategy.reset();

    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    const history: GameResult[] = [];
    const balanceHistory: number[] = [initialBalance];

    // Track previous State for strategy
    let lastBet: Bet | null = null;
    let lastResult: GameResult | null = null;

    for (let i = 0; i < rounds; i++) {
        // Reshuffle if low
        if (deck.remaining < 20) {
            deck.reset(); // This shuffles internally
        }

        // 1. Ask Strategy for Bet
        if (balance <= 0) break; // Bankrupt
        const bet = strategy.getBet(history, balance, lastBet, lastResult);
        lastBet = bet;

        // 2. Play Hand
        const p1 = deck.draw()!;
        const b1 = deck.draw()!;
        const p2 = deck.draw()!;
        const b2 = deck.draw()!;

        const pHand: Hand = [p1, p2];
        const bHand: Hand = [b1, b2];

        if (!isNatural(pHand) && !isNatural(bHand)) {
            const pAction = getPlayerThirdCardAction(pHand);
            let p3 = undefined;

            if (pAction === 'draw') {
                p3 = deck.draw()!;
                pHand.push(p3);
            }

            const bAction = getBankerThirdCardAction(bHand, p3);
            if (bAction === 'draw') {
                bHand.push(deck.draw()!);
            }
        }

        const result = determineWinner(pHand, bHand);
        lastResult = result;
        history.push(result);

        // 3. Settle Bet
        let won =
            (bet.type === 'PLAYER' && result === GameResult.PlayerWin) ||
            (bet.type === 'BANKER' && result === GameResult.BankerWin) ||
            (bet.type === 'TIE' && result === GameResult.Tie);

        let push =
            (bet.type === 'PLAYER' && result === GameResult.Tie) ||
            (bet.type === 'BANKER' && result === GameResult.Tie);

        if (bet.type === 'PLAYER') {
            if (result === GameResult.PlayerWin) {
                balance += bet.amount;
            } else if (result === GameResult.BankerWin) {
                balance -= bet.amount;
            } else {
                // Tie pushes Player bet, balance unchanged
            }
        } else if (bet.type === 'BANKER') {
            if (result === GameResult.BankerWin) {
                balance += bet.amount * 0.95;
                won = true;
            } else if (result === GameResult.PlayerWin) {
                balance -= bet.amount;
            } else {
                push = true; // Tie pushes Banker bet
            }
        } else if (bet.type === 'TIE') {
            if (result === GameResult.Tie) {
                balance += bet.amount * 8;
                won = true;
            } else {
                balance -= bet.amount;
            }
        }

        // Record balance after this round
        balanceHistory.push(balance);

        // 4. Streak Stats
        if (!push) {
            if (won) {
                if (currentStreak > 0) currentStreak++;
                else currentStreak = 1;
                if (currentStreak > maxWinStreak) maxWinStreak = currentStreak;
            } else {
                if (currentStreak < 0) currentStreak--;
                else currentStreak = -1;
                if (Math.abs(currentStreak) > maxLossStreak) maxLossStreak = Math.abs(currentStreak);
            }
        }
    }

    const pWins = history.filter(r => r === GameResult.PlayerWin).length;
    const bWins = history.filter(r => r === GameResult.BankerWin).length;
    const tWins = history.filter(r => r === GameResult.Tie).length;

    // Convert GameResult[] to simplified history format for UI if needed
    const stringHistory = history.map(r => {
        if (r === GameResult.PlayerWin) return 'P';
        if (r === GameResult.BankerWin) return 'B';
        return 'T';
    });

    return {
        totalRounds: rounds,
        playerWins: pWins,
        bankerWins: bWins,
        ties: tWins,
        maxWinStreak,
        maxLossStreak,
        finalBalance: balance,
        history: stringHistory as ('P' | 'B' | 'T')[],
        balanceHistory
    };
};
