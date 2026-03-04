import { Card, Suit, Rank } from './Card';
import { shuffleArray, getSecureRandomInt } from './Random';

export class Deck {
    private cards: Card[] = [];
    private numDecks: number;
    private cutIndex: number = 0;

    constructor(numDecks: number = 8) {
        this.numDecks = numDecks;
        this.reset();
    }

    /**
     * 重置并洗牌
     * 同时也设置一个随机的“切牌点”（通常在最后 1/4 左右）
     */
    reset(): void {
        this.cards = [];
        for (let d = 0; d < this.numDecks; d++) {
            for (const suit of Object.values(Suit)) {
                for (const rank of Object.values(Rank)) {
                    this.cards.push(new Card(suit, rank));
                }
            }
        }
        this.shuffle();

        // 设置切牌点：在最后 60-90 张牌之间（针对 8 副牌）
        // 这是一个通用的赌场标准，大约预留 1-1.5 副牌
        const minCut = Math.floor(52 * 1);
        const maxCut = Math.floor(52 * 2);
        this.cutIndex = minCut + getSecureRandomInt(maxCut - minCut);
    }

    shuffle(): void {
        shuffleArray(this.cards);
    }

    draw(): Card {
        if (this.cards.length === 0) {
            this.reset();
        }
        return this.cards.pop()!;
    }

    /**
     * 检查是否已到达切牌点
     */
    shouldReshuffle(): boolean {
        return this.cards.length <= this.cutIndex;
    }

    get remaining(): number {
        return this.cards.length;
    }
}
