import React from 'react';
import type { RouletteGameState, RouletteBetType } from '../types';
import { getNumberInfo } from '../logic/RouletteEngine';
import styles from './RouletteTable.module.css';

interface RouletteTableProps {
    gameState: RouletteGameState;
    onPlaceBet: (type: RouletteBetType, amount: number, value?: number) => void;
    selectedChip: number;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({ gameState, onPlaceBet, selectedChip }) => {
    const getBetAmount = (type: RouletteBetType, value?: number) => {
        return gameState.bets
            .filter(b => b.type === type && b.value === value)
            .reduce((sum, b) => sum + b.amount, 0);
    };

    const renderNumber = (num: number) => {
        const info = getNumberInfo(num);
        const amt = getBetAmount('straight', num);
        return (
            <div
                key={num}
                className={`${styles.cell} ${styles.number} ${styles[info.color]}`}
                onClick={() => onPlaceBet('straight', selectedChip, num)}
            >
                {num}
                {amt > 0 && <span className={styles.chipCount}>${amt}</span>}
            </div>
        );
    };

    const renderOutside = (type: RouletteBetType, label: string) => {
        const amt = getBetAmount(type);
        return (
            <div
                className={`${styles.cell} ${styles.outside}`}
                onClick={() => onPlaceBet(type, selectedChip)}
            >
                {label}
                {amt > 0 && <span className={styles.chipCount}>${amt}</span>}
            </div>
        );
    };

    // 街注起始号码：1, 4, 7, 10, ... 34
    const streetStarts = Array.from({ length: 12 }, (_, i) => i * 3 + 1);

    // 线注起始号码：1, 4, 7, ... 31（每两行一组）
    const lineStarts = Array.from({ length: 11 }, (_, i) => i * 3 + 1);

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.bettingTable}>
                {/* Zero */}
                <div
                    className={`${styles.cell} ${styles.zero}`}
                    onClick={() => onPlaceBet('straight', selectedChip, 0)}
                >
                    0
                    {getBetAmount('straight', 0) > 0 && <span className={styles.chipCount}>${getBetAmount('straight', 0)}</span>}
                </div>

                {/* Numbers 1-36 Grid (3 rows, 12 columns) */}
                {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map(renderNumber)}
                {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map(renderNumber)}
                {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map(renderNumber)}

                {/* Columns */}
                {renderOutside('column3', '2 to 1')}
                {renderOutside('column2', '2 to 1')}
                {renderOutside('column1', '2 to 1')}

                {/* Dozens */}
                <div className={styles.dozen} onClick={() => onPlaceBet('dozen1', selectedChip)}>1st 12</div>
                <div className={styles.dozen} onClick={() => onPlaceBet('dozen2', selectedChip)}>2nd 12</div>
                <div className={styles.dozen} onClick={() => onPlaceBet('dozen3', selectedChip)}>3rd 12</div>

                {/* Outside Bets */}
                {renderOutside('low', '1 - 18')}
                {renderOutside('even', 'EVEN')}
                {renderOutside('red', 'RED')}
                {renderOutside('black', 'BLACK')}
                {renderOutside('odd', 'ODD')}
                {renderOutside('high', '19 - 36')}
            </div>

            {/* 组合下注区域 */}
            <div className={styles.comboBets}>
                <h4 className={styles.comboTitle}>组合下注</h4>
                <div className={styles.comboGrid}>
                    {/* 街注 (Street Bets) */}
                    <div className={styles.comboSection}>
                        <span className={styles.comboLabel}>街注 (11:1)</span>
                        <div className={styles.comboButtons}>
                            {streetStarts.map(start => {
                                const amt = getBetAmount('street', start);
                                return (
                                    <button
                                        key={`street-${start}`}
                                        className={`${styles.comboBtn} ${amt > 0 ? styles.comboBtnActive : ''}`}
                                        onClick={() => onPlaceBet('street', selectedChip, start)}
                                        title={`街注: ${start}-${start + 2}`}
                                    >
                                        {start}-{start + 2}
                                        {amt > 0 && <span className={styles.comboBetAmt}>${amt}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 线注 (Line Bets) */}
                    <div className={styles.comboSection}>
                        <span className={styles.comboLabel}>线注 (5:1)</span>
                        <div className={styles.comboButtons}>
                            {lineStarts.map(start => {
                                const amt = getBetAmount('line', start);
                                return (
                                    <button
                                        key={`line-${start}`}
                                        className={`${styles.comboBtn} ${amt > 0 ? styles.comboBtnActive : ''}`}
                                        onClick={() => onPlaceBet('line', selectedChip, start)}
                                        title={`线注: ${start}-${start + 5}`}
                                    >
                                        {start}-{start + 5}
                                        {amt > 0 && <span className={styles.comboBetAmt}>${amt}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
