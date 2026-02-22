export type RouletteBetType =
    | 'straight' // Single number (35:1)
    | 'split'    // Two adjacent numbers (17:1)
    | 'street'   // Three numbers in a row (11:1)
    | 'corner'   // Four numbers in a square (8:1)
    | 'line'     // Six numbers, two rows (5:1)
    | 'red' | 'black'
    | 'even' | 'odd'
    | 'low' | 'high' // 1-18, 19-36
    | 'dozen1' | 'dozen2' | 'dozen3' // 1-12, 13-24, 25-36
    | 'column1' | 'column2' | 'column3';

export interface RouletteBet {
    type: RouletteBetType;
    value?: number; // For straight bet
    amount: number;
}

export const RoulettePhase = {
    Betting: 'BETTING',
    Spinning: 'SPINNING',
    Result: 'RESULT',
} as const;

export type RoulettePhase = typeof RoulettePhase[keyof typeof RoulettePhase];

export interface RouletteGameState {
    phase: RoulettePhase;
    bets: RouletteBet[];
    lastNumber: number | null;
    history: number[];
    message: string;
}
