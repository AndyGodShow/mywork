// ===== 花旗骰骰子动画组件 =====

import React from 'react';
import type { CrapsDice as CrapsDiceType } from '../types';
import styles from './CrapsDice.module.css';

interface CrapsDiceProps {
    dice: CrapsDiceType | null;
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

export const CrapsDice: React.FC<CrapsDiceProps> = ({ dice, isRolling }) => {
    const displayDice = dice || [1, 1] as CrapsDiceType;
    const sum = dice ? dice[0] + dice[1] : 0;
    const hasDice = dice !== null;

    return (
        <div className={styles.diceContainer}>
            <div className={styles.diceRow}>
                {hasDice || isRolling ? (
                    <>
                        <DiceFace value={displayDice[0]} delay={0} isRolling={isRolling} />
                        <DiceFace value={displayDice[1]} delay={150} isRolling={isRolling} />
                        {!isRolling && hasDice && (
                            <div className={styles.sumBadge}>{sum}</div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={`${styles.die} ${styles.dieEmpty}`}>
                            <div className={styles.dieFace}>?</div>
                        </div>
                        <div className={`${styles.die} ${styles.dieEmpty}`}>
                            <div className={styles.dieFace}>?</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
