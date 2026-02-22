import React from 'react';
import { Card as CardModel, Suit } from '../../logic/Card';
import styles from './Card.module.css';

interface CardProps {
    card?: CardModel;
    hidden?: boolean;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ card, hidden = false, className = '' }) => {
    const isRed = card && (card.suit === Suit.Hearts || card.suit === Suit.Diamonds);

    if (hidden || !card) {
        return (
            <div className={`${styles.card} ${styles.back} ${className}`}>
                <div className={styles.pattern}></div>
            </div>
        );
    }

    return (
        <div className={`${styles.card} ${styles.front} ${isRed ? styles.red : styles.black} ${className}`}>
            <div className={styles.topCorner}>
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
            <div className={styles.centerSuit}>{card.suit}</div>
            <div className={styles.bottomCorner}>
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
        </div>
    );
};
