import React from 'react';
import { Suit } from '../../logic/Card';

interface SuitIconProps {
    suit: Suit;
    className?: string;
    style?: React.CSSProperties;
    width?: string | number;
    height?: string | number;
}

export const SuitIcon: React.FC<SuitIconProps> = ({ suit, className = '', style, width = '1em', height = '1em' }) => {
    // 纯正的赌场级几何 SVG
    switch (suit) {
        case Suit.Spades: // 黑桃 ♠
            return (
                <svg viewBox="0 0 100 100" className={className} style={{ ...style, fill: 'currentColor' }} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 8 C40 25 15 45 15 65 C15 78 26 88 38 88 C43 88 47 86 50 82 C53 86 57 88 62 88 C74 88 85 78 85 65 C85 45 60 25 50 8 Z" />
                    <path d="M50 65 L40 95 L60 95 Z" />
                </svg>
            );
        case Suit.Hearts: // 红心 ♥
            return (
                <svg viewBox="0 0 100 100" className={className} style={{ ...style, fill: 'currentColor' }} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 30 C50 30 45 10 25 10 C10 10 5 25 5 40 C5 60 25 75 50 95 C75 75 95 60 95 40 C95 25 90 10 75 10 C55 10 50 30 50 30 Z" />
                </svg>
            );
        case Suit.Clubs: // 梅花 ♣
            return (
                <svg viewBox="0 0 100 100" className={className} style={{ ...style, fill: 'currentColor' }} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="25" r="20" />
                    <circle cx="72" cy="55" r="20" />
                    <circle cx="28" cy="55" r="20" />
                    <path d="M50 50 L40 95 L60 95 Z" />
                </svg>
            );
        case Suit.Diamonds: // 方块 ♦
            return (
                <svg viewBox="0 0 100 100" className={className} style={{ ...style, fill: 'currentColor' }} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 5 L85 50 L50 95 L15 50 Z" />
                </svg>
            );
        default:
            return null;
    }
};
