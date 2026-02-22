// ===== 三公核心引擎 =====

import { Card, Suit, Rank } from '../../../logic/Card';
import { shuffleArray } from '../../../logic/Random';
import type { SanGongHand, SanGongBet } from '../types';

const ALL_SUITS = [Suit.Spades, Suit.Hearts, Suit.Clubs, Suit.Diamonds] as const;
const ALL_RANKS = [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King] as const;

/** 创建洗好的牌组 */
export const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of ALL_SUITS) {
        for (const rank of ALL_RANKS) {
            deck.push(new Card(suit, rank));
        }
    }
    shuffleArray(deck);
    return deck;
};

/** 获取牌的三公点数 (A=1, 2-9面值, 10/J/Q/K=0 但J/Q/K为公牌) */
const getCardPoint = (card: Card): number => {
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
        case Rank.Ten: case Rank.Jack: case Rank.Queen: case Rank.King: return 0;
        default: return 0;
    }
};

/** 判断是否为公牌 (J/Q/K) */
const isFaceCard = (card: Card): boolean =>
    card.rank === Rank.Jack || card.rank === Rank.Queen || card.rank === Rank.King;

/** 评估手牌 */
export const evaluateHand = (cards: Card[]): SanGongHand => {
    const faceCount = cards.filter(c => isFaceCard(c)).length;
    const isSanGong = faceCount === 3; // 三公：三张都是J/Q/K

    const totalPoints = cards.reduce((sum, c) => sum + getCardPoint(c), 0) % 10;

    let handName: string;
    if (isSanGong) {
        handName = '三公';
    } else {
        const names = ['鳖十', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点'];
        handName = names[totalPoints];
    }

    return { cards, points: totalPoints, isSanGong, handName };
};

/** 比较两手牌 (-1/0/1) */
export const compareHands = (player: SanGongHand, banker: SanGongHand): number => {
    if (player.isSanGong && banker.isSanGong) return 0;
    if (player.isSanGong) return 1;
    if (banker.isSanGong) return -1;
    if (player.points > banker.points) return 1;
    if (player.points < banker.points) return -1;
    return 0; // 同点数算和
};

/** 计算赔付 */
export const calculatePayout = (bet: SanGongBet, result: 'player_wins' | 'banker_wins' | 'tie'): number => {
    switch (bet.type) {
        case 'player_wins':
            return result === 'player_wins' ? bet.amount * 2 : 0;
        case 'banker_wins':
            return result === 'banker_wins' ? bet.amount * 1.95 : 0; // 庄赢抽佣5%
        case 'tie':
            return result === 'tie' ? bet.amount * 9 : 0; // 8:1
        default:
            return 0;
    }
};

/** 获取结果名 */
export const getResultName = (result: 'player_wins' | 'banker_wins' | 'tie'): string => {
    switch (result) {
        case 'player_wins': return '闲赢';
        case 'banker_wins': return '庄赢';
        case 'tie': return '和局';
    }
};
