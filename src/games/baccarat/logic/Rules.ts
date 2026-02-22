import { Card } from '../../../logic/Card';

export type Hand = Card[];

export const calculateHandValue = (hand: Hand): number => {
    const total = hand.reduce((sum, card) => sum + card.value, 0);
    return total % 10;
};

export const isNatural = (hand: Hand): boolean => {
    const value = calculateHandValue(hand);
    return value === 8 || value === 9;
};

export const isPair = (hand: Hand): boolean => {
    if (hand.length < 2) return false;
    return hand[0].rank === hand[1].rank;
};

export const getPlayerThirdCardAction = (playerHand: Hand): 'draw' | 'stand' => {
    const value = calculateHandValue(playerHand);
    if (value <= 5) return 'draw';
    return 'stand';
};

export const getBankerThirdCardAction = (
    bankerHand: Hand,
    playerThirdCard?: Card
): 'draw' | 'stand' => {
    const bankerValue = calculateHandValue(bankerHand);

    // Banker standards rules when Player did not draw (same as Player rules essentially, but usually Banker stands on 6)
    if (!playerThirdCard) {
        if (bankerValue <= 5) return 'draw';
        return 'stand';
    }

    // Complex rules when Player DID draw a third card
    const playerThirdValue = playerThirdCard.value;

    switch (bankerValue) {
        case 0:
        case 1:
        case 2:
            return 'draw'; // Always draw 0-2
        case 3:
            // Draw unless player's third card is an 8
            return playerThirdValue !== 8 ? 'draw' : 'stand';
        case 4:
            // Draw if player's third card is 2-7
            return [2, 3, 4, 5, 6, 7].includes(playerThirdValue) ? 'draw' : 'stand';
        case 5:
            // Draw if player's third card is 4-7
            return [4, 5, 6, 7].includes(playerThirdValue) ? 'draw' : 'stand';
        case 6:
            // Draw if player's third card is 6 or 7
            return [6, 7].includes(playerThirdValue) ? 'draw' : 'stand';
        case 7:
            return 'stand';
        default: // 8 or 9 would have been a natural, but just in case
            return 'stand';
    }
};

export const GameResult = {
    PlayerWin: 'PLAYER_WIN',
    BankerWin: 'BANKER_WIN',
    Tie: 'TIE',
} as const;

export type GameResult = typeof GameResult[keyof typeof GameResult];

export const determineWinner = (playerHand: Hand, bankerHand: Hand): GameResult => {
    const pVal = calculateHandValue(playerHand);
    const bVal = calculateHandValue(bankerHand);

    if (pVal > bVal) return GameResult.PlayerWin;
    if (bVal > pVal) return GameResult.BankerWin;
    return GameResult.Tie;
};
