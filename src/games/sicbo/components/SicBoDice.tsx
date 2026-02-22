// ===== 骰子动画组件 =====

import React from 'react';
import type { DiceResult } from '../types';
import styles from './SicBoDice.module.css';

interface SicBoDiceProps {
    dice: DiceResult | null;
    isRolling: boolean;
}

const DOT_PATTERNS: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const DiceFace: React.FC<{ value: number; delay: number; isRolling: boolean }> = ({ value, delay, isRolling }) => {
    const dots = DOT_PATTERNS[value] || [];
    return (
        <div
            className={`${styles.die} ${isRolling ? styles.rolling : styles.landed}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={styles.dieFace}>
                {[0, 1, 2].map(row => (
                    <div key={row} className={styles.dotRow}>
                        {[0, 1, 2].map(col => {
                            const hasDot = dots.some(d => d[0] === row && d[1] === col);
                            return (
                                <div
                                    key={col}
                                    className={`${styles.dotSlot} ${hasDot ? styles.dot : ''}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SicBoDice: React.FC<SicBoDiceProps> = ({ dice, isRolling }) => {
    if (!dice && !isRolling) return null;

    const displayDice = dice || [1, 1, 1] as DiceResult;
    const sum = dice ? dice[0] + dice[1] + dice[2] : 0;

    return (
        <div className={styles.diceContainer}>
            <div className={styles.diceRow}>
                {displayDice.map((value, i) => (
                    <DiceFace key={i} value={value} delay={i * 150} isRolling={isRolling} />
                ))}
            </div>
            {dice && !isRolling && (
                <div className={styles.sumDisplay}>
                    总和: <span className={styles.sumValue}>{sum}</span>
                </div>
            )}
        </div>
    );
};
