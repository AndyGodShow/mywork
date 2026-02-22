// ===== 骰宝下注桌面 =====

import React from 'react';
import type { SicBoGameState, SicBoBetType } from '../types';
import { TOTAL_PAYOUTS } from '../types';
import styles from './SicBoTable.module.css';

interface SicBoTableProps {
    gameState: SicBoGameState;
    onPlaceBet: (type: SicBoBetType, amount: number, value?: number) => void;
    selectedChip: number;
}

/** 两骰组合列表 */
const TWO_DICE_COMBOS = [
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 3], [2, 4], [2, 5], [2, 6],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 6],
    [5, 6],
];

/** 统计某类下注的总额 */
const getBetTotal = (gameState: SicBoGameState, type: SicBoBetType, value?: number): number => {
    return gameState.bets
        .filter(b => b.type === type && (value === undefined || b.value === value))
        .reduce((sum, b) => sum + b.amount, 0);
};

export const SicBoTable: React.FC<SicBoTableProps> = ({ gameState, onPlaceBet, selectedChip }) => {
    const isBetting = gameState.phase === 'BETTING';

    const handleClick = (type: SicBoBetType, value?: number) => {
        if (!isBetting) return;
        onPlaceBet(type, selectedChip, value);
    };

    const renderChipBadge = (type: SicBoBetType, value?: number) => {
        const total = getBetTotal(gameState, type, value);
        if (total === 0) return null;
        return <span className={styles.chipBadge}>${total}</span>;
    };

    return (
        <div className={styles.tableContainer}>
            {/* === 顶部：大/小 + 单/双 === */}
            <div className={styles.mainBets}>
                <button
                    className={`${styles.betBtn} ${styles.smallBet}`}
                    onClick={() => handleClick('small')}
                    disabled={!isBetting}
                >
                    <span className={styles.betLabel}>小</span>
                    <span className={styles.betDesc}>4-10</span>
                    <span className={styles.betOdds}>1:1</span>
                    {renderChipBadge('small')}
                </button>
                <button
                    className={`${styles.betBtn} ${styles.oddBet}`}
                    onClick={() => handleClick('odd')}
                    disabled={!isBetting}
                >
                    <span className={styles.betLabel}>单</span>
                    <span className={styles.betDesc}>奇数</span>
                    <span className={styles.betOdds}>1:1</span>
                    {renderChipBadge('odd')}
                </button>
                <button
                    className={`${styles.betBtn} ${styles.evenBet}`}
                    onClick={() => handleClick('even')}
                    disabled={!isBetting}
                >
                    <span className={styles.betLabel}>双</span>
                    <span className={styles.betDesc}>偶数</span>
                    <span className={styles.betOdds}>1:1</span>
                    {renderChipBadge('even')}
                </button>
                <button
                    className={`${styles.betBtn} ${styles.bigBet}`}
                    onClick={() => handleClick('big')}
                    disabled={!isBetting}
                >
                    <span className={styles.betLabel}>大</span>
                    <span className={styles.betDesc}>11-17</span>
                    <span className={styles.betOdds}>1:1</span>
                    {renderChipBadge('big')}
                </button>
            </div>

            {/* === 总和下注 === */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>总和下注</div>
                <div className={styles.totalGrid}>
                    {Object.entries(TOTAL_PAYOUTS).map(([num, payout]) => (
                        <button
                            key={num}
                            className={`${styles.totalBtn} ${gameState.dice && (gameState.dice[0] + gameState.dice[1] + gameState.dice[2]) === Number(num)
                                    ? styles.winning : ''
                                }`}
                            onClick={() => handleClick('total', Number(num))}
                            disabled={!isBetting}
                        >
                            <span className={styles.totalNum}>{num}</span>
                            <span className={styles.totalOdds}>{payout}:1</span>
                            {renderChipBadge('total', Number(num))}
                        </button>
                    ))}
                </div>
            </div>

            {/* === 围骰区 === */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>围骰</div>
                <div className={styles.tripleRow}>
                    <button
                        className={`${styles.betBtn} ${styles.anyTriple}`}
                        onClick={() => handleClick('any_triple')}
                        disabled={!isBetting}
                    >
                        <span className={styles.betLabel}>全围</span>
                        <span className={styles.betOdds}>30:1</span>
                        {renderChipBadge('any_triple')}
                    </button>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <button
                            key={n}
                            className={`${styles.tripleBtn}`}
                            onClick={() => handleClick('specific_triple', n)}
                            disabled={!isBetting}
                        >
                            <span className={styles.tripleDice}>{`${n}${n}${n}`}</span>
                            <span className={styles.betOdds}>180:1</span>
                            {renderChipBadge('specific_triple', n)}
                        </button>
                    ))}
                </div>
            </div>

            {/* === 双骰 + 单骰 === */}
            <div className={styles.bottomSection}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>双骰</div>
                    <div className={styles.diceGrid}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <button
                                key={n}
                                className={styles.diceBtn}
                                onClick={() => handleClick('specific_double', n)}
                                disabled={!isBetting}
                            >
                                <span className={styles.diceNum}>{n}-{n}</span>
                                <span className={styles.betOdds}>10:1</span>
                                {renderChipBadge('specific_double', n)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>单骰</div>
                    <div className={styles.diceGrid}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <button
                                key={n}
                                className={styles.diceBtn}
                                onClick={() => handleClick('single', n)}
                                disabled={!isBetting}
                            >
                                <span className={styles.diceNum}>{n}</span>
                                <span className={styles.betOdds}>1~12:1</span>
                                {renderChipBadge('single', n)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* === 两骰组合 === */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>两骰组合 <span className={styles.oddsTag}>5:1</span></div>
                <div className={styles.comboGrid}>
                    {TWO_DICE_COMBOS.map(([a, b]) => (
                        <button
                            key={`${a}${b}`}
                            className={styles.comboBtn}
                            onClick={() => handleClick('two_dice_combo', a * 10 + b)}
                            disabled={!isBetting}
                        >
                            <span>{a}-{b}</span>
                            {renderChipBadge('two_dice_combo', a * 10 + b)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
