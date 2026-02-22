import { useState, useRef, useCallback } from 'react';
import { Card } from '../../../logic/Card';
import { Deck } from '../../../logic/Deck';
import {
    calculateHandValue,
    isNatural,
    getPlayerThirdCardAction,
    getBankerThirdCardAction,
    determineWinner,
    GameResult,
} from '../logic/Rules';
import type { GameState, PlayerState, RoundResult, BetType } from '../../../types';
import { GamePhase } from '../../../types';

const INITIAL_BALANCE = 10000;
const DEAL_DELAY_MS = 800;

export const useBaccaratGame = () => {
    // Deck Management
    const deckRef = useRef<Deck>(new Deck(8));

    // Player State (Bankroll)
    const [playerState, setPlayerState] = useState<PlayerState>({
        balance: INITIAL_BALANCE,
        currentBet: 0,
        bets: {}, // Initialize empty bets
    });

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        phase: GamePhase.Betting,
        playerHand: [],
        bankerHand: [],
        playerScore: 0,
        bankerScore: 0,
        history: [],
        message: '请下注',
    });

    // Helper to safely draw a card, reshuffling if needed
    const drawCard = useCallback((): Card => {
        let card = deckRef.current.draw();
        if (!card) {
            // This should ideally be caught by shouldReshuffle earlier
            deckRef.current.reset();
            card = deckRef.current.draw()!;
        }
        return card;
    }, []);

    const placeBet = (type: BetType, amount: number) => {
        if (gameState.phase !== GamePhase.Betting) return;
        if (amount > playerState.balance) return;

        setPlayerState((prev) => {
            const currentTypeBet = prev.bets[type] || 0;
            return {
                ...prev,
                currentBet: prev.currentBet + amount,
                bets: {
                    ...prev.bets,
                    [type]: currentTypeBet + amount,
                },
                balance: prev.balance - amount // Deduct immediately for multi-bet experience
            };
        });
    };

    const clearBet = () => {
        if (gameState.phase !== GamePhase.Betting) return;
        setPlayerState(prev => ({
            ...prev,
            balance: prev.balance + prev.currentBet, // Refund all
            currentBet: 0,
            bets: {}
        }));
    }

    const startGame = async () => {
        if (playerState.currentBet === 0) return;

        // Balance already deducted in placeBet

        setGameState((prev) => ({
            ...prev,
            phase: GamePhase.Dealing,
            playerHand: [],
            bankerHand: [],
            playerScore: 0,
            bankerScore: 0,
            message: '发牌中...',
        }));

        // Initial Deal Sequence with Delays
        await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
        const p1 = drawCard();
        setGameState((prev) => ({ ...prev, playerHand: [p1], playerScore: calculateHandValue([p1]) }));

        await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
        const b1 = drawCard();
        setGameState((prev) => ({ ...prev, bankerHand: [b1], bankerScore: calculateHandValue([b1]) }));

        await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
        const p2 = drawCard();
        const pHandInitial = [p1, p2];
        setGameState((prev) => ({
            ...prev,
            playerHand: pHandInitial,
            playerScore: calculateHandValue(pHandInitial),
        }));

        await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
        const b2 = drawCard();
        const bHandInitial = [b1, b2];
        setGameState((prev) => ({
            ...prev,
            bankerHand: bHandInitial,
            bankerScore: calculateHandValue(bHandInitial),
        }));

        // Check Naturals
        if (isNatural(pHandInitial) || isNatural(bHandInitial)) {
            finalizeRound(pHandInitial, bHandInitial);
            return;
        }

        // Third Card Logic
        const finalPHand = [...pHandInitial];
        const finalBHand = [...bHandInitial];
        let playerThirdCard: Card | undefined;

        // Player's Turn
        const pAction = getPlayerThirdCardAction(pHandInitial);
        if (pAction === 'draw') {
            setGameState(prev => ({ ...prev, phase: GamePhase.PlayerThirdCard, message: '闲家补牌...' }));
            await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
            playerThirdCard = drawCard();
            finalPHand.push(playerThirdCard);
            setGameState(prev => ({
                ...prev,
                playerHand: finalPHand,
                playerScore: calculateHandValue(finalPHand)
            }));
        }

        // Banker's Turn
        const bAction = getBankerThirdCardAction(bHandInitial, playerThirdCard);
        if (bAction === 'draw') {
            setGameState(prev => ({ ...prev, phase: GamePhase.BankerThirdCard, message: '庄家补牌...' }));
            await new Promise((r) => setTimeout(r, DEAL_DELAY_MS));
            const b3 = drawCard();
            finalBHand.push(b3);
            setGameState(prev => ({
                ...prev,
                bankerHand: finalBHand,
                bankerScore: calculateHandValue(finalBHand)
            }));
        }

        finalizeRound(finalPHand, finalBHand);
    };

    const finalizeRound = (pHand: Card[], bHand: Card[]) => {
        const result = determineWinner(pHand, bHand);
        const pScore = calculateHandValue(pHand);
        const bScore = calculateHandValue(bHand);

        // Payout Calculation
        let totalPayout = 0;
        const { bets } = playerState;

        // 1. Player Bet
        if (bets['PLAYER']) {
            if (result === GameResult.PlayerWin) {
                totalPayout += bets['PLAYER']! * 2;
            } else if (result === GameResult.Tie) {
                totalPayout += bets['PLAYER']!; // Push
            }
        }

        // 2. Banker Bet
        if (bets['BANKER']) {
            if (result === GameResult.BankerWin) {
                totalPayout += bets['BANKER']! + (bets['BANKER']! * 0.95);
            } else if (result === GameResult.Tie) {
                totalPayout += bets['BANKER']!; // Push
            }
        }

        // 3. Tie Bet
        if (bets['TIE']) {
            if (result === GameResult.Tie) {
                totalPayout += bets['TIE']! * 9; // 8:1 payout (bet returned + 8x bet)
            }
        }

        // 4. Pairs Side Bets
        // We need to check if the INITIAL two cards form a pair.
        // pHand and bHand might have 3 cards now.
        const pHandInitial = [pHand[0], pHand[1]];
        const bHandInitial = [bHand[0], bHand[1]];
        const pPair = pHandInitial[0].rank === pHandInitial[1].rank;
        const bPair = bHandInitial[0].rank === bHandInitial[1].rank;

        if (bets['PLAYER_PAIR'] && pPair) {
            totalPayout += bets['PLAYER_PAIR']! * 12; // 11:1 payout (bet returned + 11x bet)
        }

        if (bets['BANKER_PAIR'] && bPair) {
            totalPayout += bets['BANKER_PAIR']! * 12; // 11:1 payout
        }

        const roundResult: RoundResult = {
            winner: result,
            playerScore: pScore,
            bankerScore: bScore,
            playerHand: pHand,
            bankerHand: bHand,
            timestamp: Date.now()
        };

        setPlayerState((prev) => ({
            ...prev,
            balance: prev.balance + totalPayout,
            currentBet: 0,
            bets: {},
        }));

        setGameState((prev) => ({
            ...prev,
            phase: GamePhase.Result,
            message: `${result === GameResult.Tie ? '和局' : result === GameResult.PlayerWin ? '闲家赢!' : '庄家赢!'}`,
            history: [roundResult, ...prev.history],
        }));

        // Check if we need to reshuffle for the NEXT round
        if (deckRef.current.shouldReshuffle()) {
            deckRef.current.reset();
            setGameState(prev => ({ ...prev, message: prev.message + ' (洗牌中...)' }));
        }
    };

    const resetForNewGame = () => {
        setGameState(prev => ({
            ...prev,
            phase: GamePhase.Betting,
            playerHand: [],
            bankerHand: [],
            playerScore: 0,
            bankerScore: 0,
            message: '请下注'
        }));
    }

    const resetBalance = () => {
        setPlayerState({
            balance: INITIAL_BALANCE,
            currentBet: 0,
            bets: {}
        });
    };

    return {
        gameState,
        playerState,
        placeBet,
        clearBet,
        startGame,
        resetForNewGame,
        resetBalance,
        deckRemaining: 0 // Initial deck size is calculated when game starts
    };
};
