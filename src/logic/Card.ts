export const Suit = {
    Spades: '♠',
    Hearts: '♥',
    Clubs: '♣',
    Diamonds: '♦',
} as const;
export type Suit = typeof Suit[keyof typeof Suit];

export const Rank = {
    Ace: 'A',
    Two: '2',
    Three: '3',
    Four: '4',
    Five: '5',
    Six: '6',
    Seven: '7',
    Eight: '8',
    Nine: '9',
    Ten: '10',
    Jack: 'J',
    Queen: 'Q',
    King: 'K',
} as const;
export type Rank = typeof Rank[keyof typeof Rank];

export class Card {
    readonly suit: Suit;
    readonly rank: Rank;

    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
    }

    /**
     * Returns the Baccarat value of the card.
     * A = 1
     * 2-9 = Face value
     * 10, J, Q, K = 0
     */
    get value(): number {
        switch (this.rank) {
            case Rank.Ace:
                return 1;
            case Rank.Two:
                return 2;
            case Rank.Three:
                return 3;
            case Rank.Four:
                return 4;
            case Rank.Five:
                return 5;
            case Rank.Six:
                return 6;
            case Rank.Seven:
                return 7;
            case Rank.Eight:
                return 8;
            case Rank.Nine:
                return 9;
            case Rank.Ten:
            case Rank.Jack:
            case Rank.Queen:
            case Rank.King:
                return 0;
            default:
                throw new Error(`Unknown rank: ${this.rank}`);
        }
    }
}
