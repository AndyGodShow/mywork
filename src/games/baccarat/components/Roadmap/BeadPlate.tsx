import React from 'react';
import type { RoundResult } from '../../../../types';
import { GameResult } from '../../logic/Rules';
import { isPair } from '../../logic/Rules';
import styles from './BeadPlate.module.css';

interface BeadPlateProps {
    history: RoundResult[];
}

export const BeadPlate: React.FC<BeadPlateProps> = ({ history }) => {
    // Bead Plate usually fills from top-left, going down, then right.
    // Standard size is 6 rows by many columns.
    // We will render a fixed grid.

    // We need to reverse history because history[0] is the LATEST game. 
    // Bead Plate shows history from START to END.
    // So we need to reverse it to display chronologically.
    const chronologicalHistory = [...history].reverse();

    const rows = 6;
    const cols = 20; // Fixed width for scroll or just display latest
    const grid = Array(rows * cols).fill(null);

    // Map history to grid
    // Logic: index = col * rows + row
    chronologicalHistory.slice(- (rows * cols)).forEach((round, i) => {
        // Standard Bead Plate fills column by column (Vertical then Horizontal).
        // But in code, we usually iterate:
        // Col 0: 0, 1, 2, 3, 4, 5
        // Col 1: 6, 7, 8, 9, 10, 11
        // So the index in a 1D array is simply 'i'.
        if (i < grid.length) {
            grid[i] = round;
        }
    });

    const getBeadClass = (result: GameResult) => {
        if (result === GameResult.PlayerWin) return styles.playerBead;
        if (result === GameResult.BankerWin) return styles.bankerBead;
        return styles.tieBead;
    };

    const getBeadText = (result: GameResult) => {
        if (result === GameResult.PlayerWin) return '闲';
        if (result === GameResult.BankerWin) return '庄';
        return '和';
    };

    return (
        <div className={styles.beadPlateContainer}>
            <div className={styles.grid}>
                {grid.map((round, index) => {
                    if (!round) return <div key={index} className={styles.emptyCell} />;

                    const pPair = isPair(round.playerHand);
                    const bPair = isPair(round.bankerHand);

                    return (
                        <div key={index} className={styles.cell}>
                            <div className={`${styles.bead} ${getBeadClass(round.winner)}`}>
                                {getBeadText(round.winner)}
                                {pPair && <div className={styles.playerPairDot} />}
                                {bPair && <div className={styles.bankerPairDot} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
