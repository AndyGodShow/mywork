// ===== 龙虎斗核心引擎 =====

import { Card, Suit, Rank } from '../../../logic/Card';
import { shuffleArray } from '../../../logic/Random';
import type { DragonTigerBet, DragonTigerResult } from '../types';

const ALL_SUITS = [Suit.Spades, Suit.Hearts, Suit.Clubs, Suit.Diamonds] as const;
const ALL_RANKS = [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King] as const;

/** 创建并洗好一副牌 */
export const createShuffledDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of ALL_SUITS) {
        for (const rank of ALL_RANKS) {
            deck.push(new Card(suit, rank));
        }
    }
    shuffleArray(deck);
    return deck;
};

/** 获取牌的龙虎斗点数（A=1, 2-10面值, J=11, Q=12, K=13） */
export const getCardValue = (card: Card): number => {
    switch (card.rank) {
        case Rank.Ace: return 1;
        case Rank.Two: return 2;
        case Rank.Three: return 3;
        case Rank.Four: return 4;
        case Rank.Five: return 5;
        case Rank.Six: return 6;
        case Rank.Seven: return 7;
        case Rank.Eight: return 8;
        case Rank.Nine: return 9;
        case Rank.Ten: return 10;
        case Rank.Jack: return 11;
        case Rank.Queen: return 12;
        case Rank.King: return 13;
        default: return 0;
    }
};

/** 判断结果 */
export const determineResult = (dragonCard: Card, tigerCard: Card): DragonTigerResult => {
    const dv = getCardValue(dragonCard);
    const tv = getCardValue(tigerCard);
    if (dv > tv) return 'dragon';
    if (tv > dv) return 'tiger';
    return 'tie';
};

/** 计算赔付（含本金） */
export const calculatePayout = (bet: DragonTigerBet, result: DragonTigerResult): number => {
    switch (bet.type) {
        case 'dragon':
            if (result === 'dragon') return bet.amount * 2;
            if (result === 'tie') return bet.amount * 0.5; // 和局退一半
            return 0;
        case 'tiger':
            if (result === 'tiger') return bet.amount * 2;
            if (result === 'tie') return bet.amount * 0.5;
            return 0;
        case 'tie':
            return result === 'tie' ? bet.amount * 9 : 0; // 8:1 + 本金
        default:
            return 0;
    }
};

/** 获取结果的中文名 */
export const getResultName = (result: DragonTigerResult): string => {
    switch (result) {
        case 'dragon': return '龙';
        case 'tiger': return '虎';
        case 'tie': return '和';
    }
};
