import React from 'react';
import { Card as CardModel, Suit } from '../../logic/Card';
import styles from './Card.module.css';

interface CardProps {
    card?: CardModel;
    hidden?: boolean;
    /** 发牌顺序索引，控制 stagger 延迟（每张间隔 110ms） */
    dealIndex?: number;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    card,
    hidden = false,
    dealIndex = 0,
    className = '',
}) => {
    const isRed = card && (card.suit === Suit.Hearts || card.suit === Suit.Diamonds);
    const dealStyle: React.CSSProperties = {
        animationDelay: `${dealIndex * 110}ms`,
    };

    if (hidden || !card) {
        return (
            <div
                className={`${styles.card} ${styles.back} ${className}`}
                style={dealStyle}
            >
                <div className={styles.pattern} />
            </div>
        );
    }

    return (
        <div
            className={`${styles.card} ${styles.front} ${isRed ? styles.red : styles.black} ${className}`}
            style={dealStyle}
        >
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
