import React from 'react';
import type { BlackjackGameState } from '../types';
import { Card } from '../../../components/Card/Card';
import styles from './BlackjackTable.module.css';

interface BlackjackTableProps {
    gameState: BlackjackGameState;
}

export const BlackjackTable: React.FC<BlackjackTableProps> = ({ gameState }) => {
    const { dealerHand, playerHands, phase } = gameState;

    return (
        <div className={styles.tableContainer}>
            <div className={styles.deckInfo}>剩余牌数: {gameState.deckRemaining}</div>
            <div className={styles.statusMessage}>{gameState.message}</div>

            <div className={styles.playArea}>
                {/* Dealer Zone (Red Theme) */}
                <div className={`${styles.zone} ${styles.dealerZone}`}>
                    <div className={styles.zoneHeader}>
                        <h2>庄家 (DEALER)</h2>
                        <div className={styles.score}>
                            {phase === 'PLAYER_TURN' ? '?' : dealerHand.score}
                        </div>
                    </div>
                    <div className={styles.cardsContainer}>
                        {dealerHand.cards.map((card, idx) => (
                            <div key={`d-${idx}`} className={styles.cardWrapper}>
                                <Card
                                    card={card}
                                    hidden={phase === 'PLAYER_TURN' && idx === 1}
                                    dealIndex={idx}
                                />
                            </div>
                        ))}
                        {dealerHand.cards.length === 0 && (
                            <div className={styles.placeholder}>等待庄家...</div>
                        )}
                    </div>
                </div>

                <div className={styles.centerInfo}>
                    <div className={styles.vsBadge}>VS</div>
                </div>

                {/* Player Zone (Blue Theme) */}
                <div className={`${styles.zone} ${styles.playerZone}`}>
                    <div className={styles.zoneHeader}>
                        <h2>玩家 (PLAYER)</h2>
                        <div className={styles.score}>
                            {playerHands[0].score}
                        </div>
                    </div>
                    <div className={styles.cardsContainer}>
                        {playerHands[0].cards.map((card, idx) => (
                            <div key={`p-${idx}`} className={styles.cardWrapper}>
                                <Card card={card} dealIndex={dealerHand.cards.length + idx} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
