import React, { useState } from 'react';
import { useSlotGame } from './hooks/useSlotGame';
import { SlotMachine } from './components/SlotMachine';
import { SlotControls } from './components/SlotControls';
import { SlotSimulation } from './components/SlotSimulation';
import { SlotRulesModal } from './components/SlotRulesModal';
import { EducationalOverlay } from '../../components/Common/EducationalOverlay';
import '../../App.css';

interface SlotGameProps {
    onBackToLobby: () => void;
}

const SLOT_EDU_CONTENT = {
    title: "老虎机：RTP、波动率与赌场优势",
    sections: [
        {
            subtitle: "老虎机的基本数学原理",
            content: "老虎机使用加权随机数生成器 (PRNG) 来决定每次旋转的结果。每个符号出现的概率不同 — 高赔符号概率更低，低赔符号概率更高。",
            highlights: [
                "RTP (返还率) 是长期统计概念，短期内波动巨大。",
                "每次旋转完全独立，不受之前结果影响。"
            ]
        },
        {
            subtitle: "赌场优势从何而来？",
            content: "老虎机通过精心设计的符号权重表来确保赌场优势。虽然偶尔会有大的赢额出现，但从数学期望上，玩家每次旋转都在以赌场优势的比例损失资金。",
            highlights: [
                "典型 RTP 约 95%，即赌场优势约 5%。",
                "真实赌场中 RTP 通常在 85%-98% 之间。",
                "大奖 (Jackpot) 需要极低概率才能触发。"
            ]
        },
        {
            subtitle: "波动率 (Volatility)",
            content: "高波动率的老虎机意味着中奖频率低，但单次中奖金额大；低波动率则反之。无论波动率如何，长期 RTP 是一样的。",
            highlights: [
                "高波动率：适合追求大奖的冒险型者。",
                "低波动率：适合追求稳定游戏时间的玩家。",
                "波动率不影响赌场的长期优势。"
            ]
        }
    ]
};

export const SlotGame: React.FC<SlotGameProps> = ({ onBackToLobby }) => {
    const [mode, setMode] = useState<'GAME' | 'SIMULATION'>('GAME');

    const {
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
    } = useSlotGame();

    const [showEducation, setShowEducation] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const lastWin = gameState.lastResult?.totalWin ?? 0;

    return (
        <div className="game-container">
            <header className="game-header">
                <div className="header-left">
                    <button className="back-btn" onClick={onBackToLobby}>← 返回大厅</button>
                    <h1>老虎机 (Slot Machine)</h1>
                </div>
                <div className="header-controls">
                    <button
                        className={`mode-btn ${mode === 'GAME' ? 'active' : ''}`}
                        onClick={() => setMode('GAME')}
                    >
                        游戏模式
                    </button>
                    <button
                        className={`mode-btn ${mode === 'SIMULATION' ? 'active' : ''}`}
                        onClick={() => setMode('SIMULATION')}
                    >
                        模拟测试
                    </button>
                    <button
                        className="edu-hub-btn"
                        onClick={() => setShowEducation(true)}
                        title="教育科普"
                    >
                        🎓 概率分析
                    </button>
                    <button
                        className="help-btn"
                        onClick={() => setShowRules(true)}
                        title="游戏说明"
                    >
                        ?
                    </button>
                </div>
            </header>

            <SlotRulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
            <EducationalOverlay
                isOpen={showEducation}
                onClose={() => setShowEducation(false)}
                content={SLOT_EDU_CONTENT}
            />

            <main className="game-area">
                {mode === 'GAME' ? (
                    <div className="slots-layout">
                        {/* Machine + Controls integrated in one visual unit */}
                        <SlotMachine
                            reels={gameState.reels}
                            phase={gameState.phase}
                            result={gameState.lastResult}
                            activeLines={gameState.activeLines}
                        >
                            <SlotControls
                                phase={gameState.phase}
                                balance={balance}
                                betPerLine={gameState.betPerLine}
                                activeLines={gameState.activeLines}
                                totalBet={totalBet}
                                lastWin={lastWin}
                                onSetBetPerLine={setBetPerLine}
                                onSetActiveLines={setActiveLines}
                                onSpin={spin}
                                onReset={resetGame}
                                onResetBalance={resetBalance}
                                autoSpinCount={autoSpinCount}
                                isAutoSpinning={isAutoSpinning}
                                onAutoSpin={startAutoSpin}
                                onStopAutoSpin={stopAutoSpin}
                            />
                        </SlotMachine>
                    </div>
                ) : (
                    <div className="simulation-area">
                        <SlotSimulation />
                    </div>
                )}
            </main>
        </div>
    );
};
