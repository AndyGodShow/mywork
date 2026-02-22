// ===== 三公游戏 Hook =====

import { useState, useCallback } from 'react';
import { SanGongPhase } from '../types';
import type { SanGongGameState, SanGongBetType } from '../types';
import { createDeck, evaluateHand, compareHands, calculatePayout, getResultName } from '../logic/SanGongEngine';

const INITIAL_BALANCE = 10000;
const DEAL_DURATION_MS = 1500;

export const useSanGongGame = () => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [gameState, setGameState] = useState<SanGongGameState>({
        phase: SanGongPhase.Betting,
        bets: [],
        playerHand: null,
        bankerHand: null,
        result: null,
        history: [],
        message: '请选择下注：闲赢、庄赢 或 和局',
    });

    const placeBet = (type: SanGongBetType, amount: number) => {
        if (gameState.phase !== SanGongPhase.Betting || amount > balance) return;
        setBalance(prev => prev - amount);
        setGameState(prev => ({ ...prev, bets: [...prev.bets, { type, amount }] }));
    };

    const clearBets = () => {
        if (gameState.phase !== SanGongPhase.Betting) return;
        const total = gameState.bets.reduce((s, b) => s + b.amount, 0);
        setBalance(prev => prev + total);
        setGameState(prev => ({ ...prev, bets: [] }));
    };

    const deal = useCallback(async () => {
        if (gameState.phase !== SanGongPhase.Betting || gameState.bets.length === 0) return;

        const deck = createDeck();
        const playerHand = evaluateHand([deck[0], deck[1], deck[2]]);
        const bankerHand = evaluateHand([deck[3], deck[4], deck[5]]);

        setGameState(prev => ({ ...prev, phase: SanGongPhase.Dealing, playerHand, bankerHand: null, message: '发牌中...' }));

        await new Promise(r => setTimeout(r, DEAL_DURATION_MS));

        const cmp = compareHands(playerHand, bankerHand);
        const result: 'player_wins' | 'banker_wins' | 'tie' = cmp > 0 ? 'player_wins' : cmp < 0 ? 'banker_wins' : 'tie';

        let totalWin = 0;
        gameState.bets.forEach(bet => { totalWin += calculatePayout(bet, result); });

        setBalance(prev => prev + totalWin);
        setGameState(prev => ({
            ...prev,
            phase: SanGongPhase.Result, bankerHand, result,
            history: [result, ...prev.history].slice(0, 20),
            message: `${getResultName(result)}！闲：${playerHand.handName} vs 庄：${bankerHand.handName}${totalWin > 0 ? ` | 赢得: $${totalWin}` : ' | 未中奖'}`,
        }));
    }, [gameState.bets, gameState.phase]);

    const resetGame = () => setGameState(prev => ({
        ...prev, phase: SanGongPhase.Betting, bets: [],
        playerHand: null, bankerHand: null, result: null,
        message: '请选择下注：闲赢、庄赢 或 和局',
    }));

    const resetBalance = () => setBalance(INITIAL_BALANCE);

    return { gameState, balance, placeBet, clearBets, deal, resetGame, resetBalance };
};
