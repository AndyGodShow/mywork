// ===== 三公主入口 =====

import React, { useState } from 'react';
import { useSanGongGame } from './hooks/useSanGongGame';
import { getResultName } from './logic/SanGongEngine';
import { SGSimulation } from './components/SGSimulation';
import { SGRulesModal } from './components/SGRulesModal';
import { EducationalOverlay } from '../../components/Common/EducationalOverlay';
import '../../App.css';
import styles from './components/SanGong.module.css';

interface Props { onBackToLobby: () => void; }

const EDU_CONTENT = {
    title: "三公：点数与概率的博弈",
    sections: [
        {
            subtitle: "三公的数学",
            content: "三公使用 52 张牌，各发 3 张。三公（三张公牌 J/Q/K）是最大的手牌，概率约为 0.99%。其余按点数比大小（取个位）。",
            highlights: [
                "三公概率：C(12,3)/C(52,3) ≈ 0.99%。",
                "9 点的概率约为 9.6%，鳖十（0点）约为 7.2%。"
            ]
        },
        {
            subtitle: "庄闲对比",
            content: "三公的庄闲胜率接近均等，但庄赢通常会抽佣 5%（类似百家乐），因此押庄的实际回报率略低。",
            highlights: [
                "和局概率约 13.7%，和局赔率 8:1 的赌场优势较高。",
                "押闲或庄是较为理性的选择。"
            ]
        },
    ]
};

export const SanGongGame: React.FC<Props> = ({ onBackToLobby }) => {
    const [mode, setMode] = useState<'GAME' | 'SIMULATION'>('GAME');
    const { gameState, balance, placeBet, clearBets, deal, resetGame, resetBalance } = useSanGongGame();
    const [selectedChip, setSelectedChip] = useState(100);
    const [showEdu, setShowEdu] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const totalBet = gameState.bets.reduce((s, b) => s + b.amount, 0);
    const isBetting = gameState.phase === 'BETTING';
    const isResult = gameState.phase === 'RESULT';
    const CHIPS = [10, 50, 100, 500, 1000];
    const getBetTotal = (type: string) => gameState.bets.filter(b => b.type === type).reduce((s, b) => s + b.amount, 0);

    const renderHand = (hand: import('./types').SanGongHand | null, label: string, side: 'player' | 'banker', showCards: boolean) => (
        <div className={`${styles.handSide} ${styles[side]}`}>
            <div className={styles.handLabel}>{label}</div>
            <div className={styles.cardsRow}>
                {hand && showCards ? hand.cards.map((c, i) => (
                    <div key={i} className={styles.card}>
                        <span className={c.suit === '♥' || c.suit === '♦' ? styles.red : styles.black}>
                            {c.rank}{c.suit}
                        </span>
                    </div>
                )) : [0, 1, 2].map(i => (
                    <div key={i} className={`${styles.card} ${styles.cardBack}`}>🂠</div>
                ))}
            </div>
            {hand && showCards && <div className={styles.handInfo}>{hand.handName} {hand.isSanGong ? '🏆' : `(${hand.points}点)`}</div>}
        </div>
    );

    return (
        <div className="game-container">
            <header className="game-header">
                <div className="header-left">
                    <button className="back-btn" onClick={onBackToLobby}>← 返回大厅</button>
                    <h1>三公 (San Gong)</h1>
                </div>
                <div className="header-controls">
                    <button className={`mode-btn ${mode === 'GAME' ? 'active' : ''}`} onClick={() => setMode('GAME')}>游戏模式</button>
                    <button className={`mode-btn ${mode === 'SIMULATION' ? 'active' : ''}`} onClick={() => setMode('SIMULATION')}>模拟测试</button>
                    <button className="edu-hub-btn" onClick={() => setShowEdu(true)}>🎓 概率分析</button>
                    <button className="help-btn" onClick={() => setShowRules(true)}>?</button>
                </div>
            </header>

            <SGRulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
            <EducationalOverlay isOpen={showEdu} onClose={() => setShowEdu(false)} content={EDU_CONTENT} />

            <main className="game-area">
                {mode === 'GAME' ? (
                    <div className={styles.layout}>
                        {/* 手牌区 */}
                        <div className={styles.handsArea}>
                            {renderHand(gameState.playerHand, '闲 Player', 'player', true)}
                            <div className={styles.vs}>
                                {isResult && gameState.result ? getResultName(gameState.result) : 'VS'}
                            </div>
                            {renderHand(gameState.bankerHand, '庄 Banker', 'banker', gameState.phase === 'RESULT')}
                        </div>

                        {gameState.message && <div className={styles.messageBar}>{gameState.message}</div>}

                        {/* 下注区 */}
                        <div className={styles.betArea}>
                            {[
                                { type: 'player_wins' as const, label: '闲赢', color: '#1565c0', odds: '1:1' },
                                { type: 'tie' as const, label: '和局', color: '#2e7d32', odds: '8:1' },
                                { type: 'banker_wins' as const, label: '庄赢', color: '#c62828', odds: '0.95:1' },
                            ].map(b => (
                                <button key={b.type} className={styles.betBtn}
                                    style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}dd)` }}
                                    onClick={() => isBetting && placeBet(b.type, selectedChip)} disabled={!isBetting}>
                                    <span className={styles.betBtnLabel}>{b.label}</span>
                                    <span className={styles.betBtnOdds}>{b.odds}</span>
                                    {getBetTotal(b.type) > 0 && <span className={styles.chipBadge}>${getBetTotal(b.type)}</span>}
                                </button>
                            ))}
                        </div>

                        {/* 控制区 */}
                        <div className={styles.controls}>
                            <div className={styles.statsRow}>
                                <span className={styles.stat}>余额: <strong>${balance.toLocaleString()}</strong>
                                    <button className={styles.resetBalBtn} onClick={resetBalance}>↺</button></span>
                                <span className={styles.stat}>下注: <strong>${totalBet}</strong></span>
                                {gameState.history.length > 0 && (
                                    <div className={styles.history}>
                                        {gameState.history.slice(0, 12).map((r, i) => (
                                            <span key={i} className={`${styles.histDot} ${styles[`hist_${r}`]}`}>
                                                {r === 'player_wins' ? '闲' : r === 'banker_wins' ? '庄' : '和'}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.chipRow}>
                                {CHIPS.map(c => (
                                    <button key={c} className={`${styles.chip} ${selectedChip === c ? styles.chipSel : ''}`}
                                        onClick={() => setSelectedChip(c)}>{c >= 1000 ? `${c / 1000}k` : c}</button>
                                ))}
                            </div>
                            <div className={styles.btnRow}>
                                {isBetting && <>
                                    <button className={styles.dealBtn} onClick={deal} disabled={totalBet === 0}>🃏 发牌</button>
                                    <button className={styles.clearBtn} onClick={clearBets}>清除</button>
                                </>}
                                {isResult && <button className={styles.resetBtn} onClick={resetGame}>新一轮</button>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="simulation-area"><SGSimulation /></div>
                )}
            </main>
        </div>
    );
};
