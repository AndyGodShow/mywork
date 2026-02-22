import { useState, useCallback, useRef, useEffect } from 'react';
import { SlotPhase, PAYLINES } from '../types';
import type { SlotGameState } from '../types';
import { generateReels, evaluateSpin } from '../logic/SlotEngine';

const INITIAL_BALANCE = 10000;
const SPIN_DURATION_MS = 2400; // 延长以配合卷轴依次停止动画
const AUTO_RETURN_DELAY_MS = 2200; // 结果阶段后自动回到下注

export const useSlotGame = () => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [gameState, setGameState] = useState<SlotGameState>({
        phase: SlotPhase.Betting,
        reels: generateReels(),
        betPerLine: 10,
        activeLines: PAYLINES,
        lastResult: null,
        history: [],
        message: '选择下注金额，点击旋转开始',
    });

    // 自动旋转状态
    const [autoSpinCount, setAutoSpinCount] = useState(0); // -1 = 无限
    const [isAutoSpinning, setIsAutoSpinning] = useState(false);
    const autoSpinRef = useRef(false);
    const autoReturnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const totalBet = gameState.betPerLine * gameState.activeLines;

    const setBetPerLine = useCallback((amount: number) => {
        if (gameState.phase !== SlotPhase.Betting) return;
        setGameState(prev => ({ ...prev, betPerLine: Math.max(1, amount) }));
    }, [gameState.phase]);

    const setActiveLines = useCallback((lines: number) => {
        if (gameState.phase !== SlotPhase.Betting) return;
        setGameState(prev => ({ ...prev, activeLines: Math.max(1, Math.min(PAYLINES, lines)) }));
    }, [gameState.phase]);

    const spin = useCallback(async () => {
        if (gameState.phase !== SlotPhase.Betting) return;
        const bet = gameState.betPerLine * gameState.activeLines;
        if (bet > balance || bet <= 0) return;

        // 清除可能存在的自动返回计时器
        if (autoReturnTimerRef.current) {
            clearTimeout(autoReturnTimerRef.current);
            autoReturnTimerRef.current = null;
        }

        // 扣除下注
        setBalance(prev => prev - bet);

        // 进入旋转状态
        setGameState(prev => ({
            ...prev,
            phase: SlotPhase.Spinning,
            lastResult: null,
            message: '旋转中...',
        }));

        // 等待动画
        await new Promise(r => setTimeout(r, SPIN_DURATION_MS));

        // 生成结果
        const reels = generateReels();
        const result = evaluateSpin(reels, gameState.betPerLine, gameState.activeLines);

        // 赢额入账
        setBalance(prev => prev + result.totalWin);

        setGameState(prev => ({
            ...prev,
            phase: SlotPhase.Result,
            reels,
            lastResult: result,
            history: [{ totalBet: bet, totalWin: result.totalWin }, ...prev.history].slice(0, 50),
            message: result.totalWin > 0
                ? `赢得 $${result.totalWin.toLocaleString()}`
                : '未中奖',
        }));
    }, [gameState.phase, gameState.betPerLine, gameState.activeLines, balance]);

    // 结果阶段自动回到下注
    useEffect(() => {
        if (gameState.phase === SlotPhase.Result) {
            autoReturnTimerRef.current = setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    phase: SlotPhase.Betting,
                    message: '选择下注金额，点击旋转开始',
                }));
            }, AUTO_RETURN_DELAY_MS);

            return () => {
                if (autoReturnTimerRef.current) {
                    clearTimeout(autoReturnTimerRef.current);
                }
            };
        }
    }, [gameState.phase]);

    const stopAutoSpin = useCallback(() => {
        autoSpinRef.current = false;
        setIsAutoSpinning(false);
        setAutoSpinCount(0);
    }, []);

    const startAutoSpin = useCallback((count: number) => {
        autoSpinRef.current = true;
        setIsAutoSpinning(true);
        setAutoSpinCount(count);
        spin();
    }, [spin]);

    useEffect(() => {
        if (!autoSpinRef.current) return;
        if (gameState.phase !== SlotPhase.Betting) return;

        const bet = gameState.betPerLine * gameState.activeLines;
        if (bet > balance || bet <= 0) {
            // 余额不足，使用 setTimeout 避免在 effect 中同步 setState
            setTimeout(() => stopAutoSpin(), 0);
            return;
        }

        // 短暂延迟后自动旋转
        const timer = setTimeout(() => {
            if (!autoSpinRef.current) return;

            // 如果不是无限模式，递减计数
            setAutoSpinCount(prev => {
                if (prev > 0) {
                    const next = prev - 1;
                    if (next <= 0) {
                        autoSpinRef.current = false;
                        setIsAutoSpinning(false);
                        return 0;
                    }
                    return next;
                }
                return prev; // -1 无限
            });

            spin();
        }, 500);

        return () => clearTimeout(timer);
    }, [gameState.phase, balance, gameState.betPerLine, gameState.activeLines, spin, stopAutoSpin]);

    const resetGame = useCallback(() => {
        stopAutoSpin();
        if (autoReturnTimerRef.current) {
            clearTimeout(autoReturnTimerRef.current);
        }
        setBalance(INITIAL_BALANCE);
        setGameState({
            phase: SlotPhase.Betting,
            reels: generateReels(),
            betPerLine: 10,
            activeLines: PAYLINES,
            lastResult: null,
            history: [],
            message: '选择下注金额，点击旋转开始',
        });
    }, [stopAutoSpin]);

    const resetBalance = useCallback(() => {
        setBalance(INITIAL_BALANCE);
    }, []);

    return {
        gameState,
        balance,
        totalBet,
        spin,
        setBetPerLine,
        setActiveLines,
        resetGame,
        resetBalance,
        autoSpinCount,
        isAutoSpinning,
        startAutoSpin,
        stopAutoSpin,
    };
};
