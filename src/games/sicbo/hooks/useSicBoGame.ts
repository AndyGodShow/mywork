// ===== 骰宝游戏状态 Hook =====

import { useState, useCallback } from 'react';
import { SicBoPhase } from '../types';
import type { SicBoGameState, SicBoBetType, DiceResult } from '../types';
import { rollDice, calculatePayout } from '../logic/SicBoEngine';

const INITIAL_BALANCE = 10000;
const ROLL_DURATION_MS = 2000;

export const useSicBoGame = () => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
    const [gameState, setGameState] = useState<SicBoGameState>({
        phase: SicBoPhase.Betting,
        bets: [],
        dice: null,
        history: [],
        message: '请选择下注区域',
    });

    const placeBet = (type: SicBoBetType, amount: number, value?: number) => {
        if (gameState.phase !== SicBoPhase.Betting) return;
        if (amount > balance) return;

        setBalance(prev => prev - amount);
        setGameState(prev => ({
            ...prev,
            bets: [...prev.bets, { type, amount, value }],
        }));
    };

    const clearBets = () => {
        if (gameState.phase !== SicBoPhase.Betting) return;
        const totalBet = gameState.bets.reduce((sum, b) => sum + b.amount, 0);
        setBalance(prev => prev + totalBet);
        setGameState(prev => ({
            ...prev,
            bets: [],
        }));
    };

    const roll = useCallback(async () => {
        if (gameState.phase !== SicBoPhase.Betting || gameState.bets.length === 0) return;

        // 生成骰子结果
        const dice = rollDice();
        setDiceResult(dice);

        setGameState(prev => ({
            ...prev,
            phase: SicBoPhase.Rolling,
            message: '骰子正在摇动...',
        }));

        // 等待动画完成
        await new Promise(r => setTimeout(r, ROLL_DURATION_MS));

        // 计算赔付
        let totalWin = 0;
        gameState.bets.forEach(bet => {
            totalWin += calculatePayout(bet, dice);
        });

        setBalance(prev => prev + totalWin);

        const sum = dice[0] + dice[1] + dice[2];
        setGameState(prev => ({
            ...prev,
            phase: SicBoPhase.Result,
            dice,
            history: [dice, ...prev.history].slice(0, 20),
            message: `骰子: ${dice.join(', ')} | 总和: ${sum} | ${totalWin > 0 ? `赢得: $${totalWin}` : '未中奖'}`,
        }));
    }, [gameState.bets, gameState.phase]);

    const resetGame = () => {
        setDiceResult(null);
        setGameState(prev => ({
            ...prev,
            phase: SicBoPhase.Betting,
            bets: [],
            dice: null,
            message: '请选择下注区域',
        }));
    };

    const resetBalance = () => {
        setBalance(INITIAL_BALANCE);
    };

    return {
        gameState,
        balance,
        diceResult,
        placeBet,
        clearBets,
        roll,
        resetGame,
        resetBalance,
    };
};
