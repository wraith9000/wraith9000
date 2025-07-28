import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    IconButton,
    Fade,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Card {
    suit: string;
    value: string;
    numericValue: number;
}

interface Player {
    cards: Card[];
    score: number;
    isBusted: boolean;
}

interface BlackJackGameProps {
    open?: boolean;
    onClose?: () => void;
}

const BlackJackGame: React.FC<BlackJackGameProps> = ({ open = false, onClose }) => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
    const [player, setPlayer] = useState<Player>({ cards: [], score: 0, isBusted: false });
    const [dealer, setDealer] = useState<Player>({ cards: [], score: 0, isBusted: false });
    const [deck, setDeck] = useState<Card[]>([]);
    const [gameResult, setGameResult] = useState<string>('');
    const [bet, setBet] = useState<number>(100);
    const [balance, setBalance] = useState<number>(1000);
    const [isDealerRevealed, setIsDealerRevealed] = useState<boolean>(false);

    // Bet adjustment functions
    const increaseBet = () => {
        if (bet < balance && bet < 500) {
            setBet(prev => Math.min(prev + 50, balance, 500));
            playButtonSound();
        }
    };

    const decreaseBet = () => {
        if (bet > 50) {
            setBet(prev => Math.max(prev - 50, 50));
            playButtonSound();
        }
    };

    // Sound effects using Web Audio API
    const audioContextRef = useRef<AudioContext | null>(null);

    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // Initialize Web Audio API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    const generateSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + duration);
    };

    const playCardSound = () => {
        // Card flip sound - quick high pitch
        generateSound(800, 0.1, 'sine');
        setTimeout(() => generateSound(600, 0.1, 'sine'), 50);
    };

    const playWinSound = () => {
        // Victory fanfare - ascending notes
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        notes.forEach((note, index) => {
            setTimeout(() => generateSound(note, 0.3, 'sine'), index * 150);
        });
    };

    const playLoseSound = () => {
        // Defeat sound - descending notes
        const notes = [523, 494, 466, 440]; // C, B, A#, A
        notes.forEach((note, index) => {
            setTimeout(() => generateSound(note, 0.2, 'square'), index * 100);
        });
    };

    const playButtonSound = () => {
        // Button click - short beep
        generateSound(400, 0.05, 'sine');
    };

    const createDeck = (): Card[] => {
        const newDeck: Card[] = [];
        suits.forEach(suit => {
            values.forEach(value => {
                let numericValue: number;
                if (value === 'A') {
                    numericValue = 11;
                } else if (['J', 'Q', 'K'].includes(value)) {
                    numericValue = 10;
                } else {
                    numericValue = parseInt(value);
                }
                newDeck.push({ suit, value, numericValue });
            });
        });
        return shuffleDeck(newDeck);
    };

    const shuffleDeck = (deck: Card[]): Card[] => {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const calculateScore = (cards: Card[]): number => {
        let score = 0;
        let aces = 0;

        cards.forEach(card => {
            if (card.value === 'A') {
                aces += 1;
                score += 11;
            } else {
                score += card.numericValue;
            }
        });

        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }

        return score;
    };

    const dealCard = (currentDeck: Card[]): [Card, Card[]] => {
        const card = currentDeck[0];
        const remainingDeck = currentDeck.slice(1);
        return [card, remainingDeck];
    };

    const startGame = () => {
        playButtonSound();

        const newDeck = createDeck();
        const [card1, deck1] = dealCard(newDeck);
        const [card2, deck2] = dealCard(deck1);
        const [dealerCard1, deck3] = dealCard(deck2);
        const [dealerCard2, deck4] = dealCard(deck3);

        const playerCards = [card1, card2];
        const dealerCards = [dealerCard1, dealerCard2];

        setPlayer({
            cards: playerCards,
            score: calculateScore(playerCards),
            isBusted: false,
        });

        setDealer({
            cards: dealerCards,
            score: calculateScore(dealerCards),
            isBusted: false,
        });

        setDeck(deck4);
        setGameState('playing');
        setIsDealerRevealed(false);
        setGameResult('');
    };

    const hit = () => {
        if (deck.length === 0) return;

        playCardSound();

        const [newCard, remainingDeck] = dealCard(deck);
        const newPlayerCards = [...player.cards, newCard];
        const newScore = calculateScore(newPlayerCards);

        setPlayer({
            cards: newPlayerCards,
            score: newScore,
            isBusted: newScore > 21,
        });

        setDeck(remainingDeck);

        if (newScore > 21) {
            endGame('bust');
        }
    };

    const stand = () => {
        playButtonSound();
        setIsDealerRevealed(true);
        dealerPlay();
    };

    const dealerPlay = () => {
        let currentDeck = deck;
        let currentDealer = { ...dealer };

        while (currentDealer.score < 17 && currentDeck.length > 0) {
            const [newCard, remainingDeck] = dealCard(currentDeck);
            const newDealerCards = [...currentDealer.cards, newCard];
            const newScore = calculateScore(newDealerCards);

            currentDealer = {
                cards: newDealerCards,
                score: newScore,
                isBusted: newScore > 21,
            };

            currentDeck = remainingDeck;
        }

        setDealer(currentDealer);
        setDeck(currentDeck);

        // Determine winner
        if (currentDealer.isBusted) {
            endGame('dealer_bust');
        } else if (currentDealer.score > player.score) {
            endGame('dealer_win');
        } else if (currentDealer.score < player.score) {
            endGame('player_win');
        } else {
            endGame('push');
        }
    };

    const endGame = (result: string) => {
        setGameState('gameOver');
        setIsDealerRevealed(true);

        switch (result) {
            case 'bust':
                setGameResult('Bust! You lose!');
                setBalance(prev => prev - bet);
                playLoseSound();
                break;
            case 'dealer_bust':
                setGameResult('Dealer busts! You win!');
                setBalance(prev => prev + bet);
                playWinSound();
                break;
            case 'dealer_win':
                setGameResult('Dealer wins!');
                setBalance(prev => prev - bet);
                playLoseSound();
                break;
            case 'player_win':
                setGameResult('You win!');
                setBalance(prev => prev + bet);
                playWinSound();
                break;
            case 'push':
                setGameResult('Push! It\'s a tie!');
                break;
        }
    };

    const resetGame = () => {
        playButtonSound();
        setGameState('menu');
        setPlayer({ cards: [], score: 0, isBusted: false });
        setDealer({ cards: [], score: 0, isBusted: false });
        setGameResult('');
        setIsDealerRevealed(false);
        onClose?.();
    };

    const renderCard = (card: Card, isHidden: boolean = false) => (
        <Card
            role="img"
            aria-label={isHidden ? "Hidden card" : `${card.value} of ${card.suit}`}
            sx={{
                width: 80,
                height: 120,
                m: 0.5,
                background: isHidden
                    ? 'linear-gradient(135deg, #2effbf 0%, #ffe53b 100%)'
                    : 'white',
                border: '2px solid #2effbf',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(46, 255, 191, 0.3)',
            }}
        >
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
                {isHidden ? (
                    <Typography variant="h6" sx={{ color: '#181f32' }}>
                        ?
                    </Typography>
                ) : (
                    <>
                        <Typography
                            variant="h6"
                            sx={{
                                color: card.suit === '♥' || card.suit === '♦' ? 'red' : 'black',
                                fontWeight: 'bold',
                            }}
                        >
                            {card.value}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: card.suit === '♥' || card.suit === '♦' ? 'red' : 'black',
                            }}
                        >
                            {card.suit}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Dialog
            open={open}
            onClose={gameState === 'playing' ? undefined : resetGame}
            maxWidth="md"
            fullWidth
            keepMounted={false}
            disableRestoreFocus
            PaperProps={{
                sx: {
                    background: 'linear-gradient(135deg, #181f32 0%, #2a2f42 100%)',
                    color: 'white',
                    borderRadius: 3,
                    border: '2px solid #2effbf',
                },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#2effbf' }}>
                        Black Jack
                    </Typography>
                    <IconButton
                        onClick={resetGame}
                        sx={{ color: '#2effbf' }}
                        aria-label="Close game"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {gameState === 'menu' && (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h4" mb={3} sx={{ color: '#2effbf', fontWeight: 900 }}>
                            Welcome to Black Jack!
                        </Typography>
                        <Typography variant="body1" mb={4} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Get as close to 21 as possible without going over. Beat the dealer to win!
                        </Typography>

                        {/* Bet Selection */}
                        <Box mb={4}>
                            <Typography variant="h6" mb={2} sx={{ color: '#ffe53b' }}>
                                Set Your Bet
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                <Button
                                    size="small"
                                    onClick={decreaseBet}
                                    disabled={bet <= 50}
                                    aria-label="Decrease bet"
                                    sx={{
                                        minWidth: 40,
                                        height: 40,
                                        bgcolor: '#ffe53b',
                                        color: '#181f32',
                                        '&:hover': { bgcolor: '#ffd700' },
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    -
                                </Button>
                                <Chip
                                    label={`$${bet}`}
                                    sx={{
                                        bgcolor: '#2effbf',
                                        color: '#181f32',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        px: 3,
                                        py: 1,
                                    }}
                                />
                                <Button
                                    size="small"
                                    onClick={increaseBet}
                                    disabled={bet >= balance || bet >= 500}
                                    aria-label="Increase bet"
                                    sx={{
                                        minWidth: 40,
                                        height: 40,
                                        bgcolor: '#ffe53b',
                                        color: '#181f32',
                                        '&:hover': { bgcolor: '#ffd700' },
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    +
                                </Button>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Balance: ${balance} | Min: $50 | Max: $500
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={startGame}
                            aria-label="Start Black Jack game"
                            sx={{
                                bgcolor: '#2effbf',
                                color: '#181f32',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                px: 4,
                                py: 2,
                                '&:hover': { bgcolor: '#1effaf' },
                            }}
                        >
                            Start Game
                        </Button>
                    </Box>
                )}

                {gameState === 'playing' && (
                    <Box>
                        {/* Balance and Bet */}
                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Chip
                                label={`Balance: $${balance}`}
                                sx={{
                                    bgcolor: '#2effbf',
                                    color: '#181f32',
                                    fontWeight: 'bold',
                                }}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    size="small"
                                    onClick={decreaseBet}
                                    disabled={bet <= 50}
                                    aria-label="Decrease bet"
                                    sx={{
                                        minWidth: 32,
                                        height: 32,
                                        bgcolor: '#ffe53b',
                                        color: '#181f32',
                                        '&:hover': { bgcolor: '#ffd700' },
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    -
                                </Button>
                                <Chip
                                    label={`Bet: $${bet}`}
                                    sx={{
                                        bgcolor: '#ffe53b',
                                        color: '#181f32',
                                        fontWeight: 'bold',
                                    }}
                                />
                                <Button
                                    size="small"
                                    onClick={increaseBet}
                                    disabled={bet >= balance || bet >= 500}
                                    aria-label="Increase bet"
                                    sx={{
                                        minWidth: 32,
                                        height: 32,
                                        bgcolor: '#ffe53b',
                                        color: '#181f32',
                                        '&:hover': { bgcolor: '#ffd700' },
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>

                        {/* Dealer Section */}
                        <Box mb={4}>
                            <Typography variant="h6" mb={2} sx={{ color: '#ffe53b' }}>
                                Dealer's Hand {isDealerRevealed && `(${dealer.score})`}
                            </Typography>
                            <Box display="flex" justifyContent="center" flexWrap="wrap">
                                {dealer.cards.map((card, index) => (
                                    <Fade key={index} in={true} timeout={500 + index * 200}>
                                        <Box>
                                            {renderCard(card, index === 1 && !isDealerRevealed)}
                                        </Box>
                                    </Fade>
                                ))}
                            </Box>
                        </Box>

                        {/* Player Section */}
                        <Box mb={4}>
                            <Typography variant="h6" mb={2} sx={{ color: '#2effbf' }}>
                                Your Hand ({player.score})
                            </Typography>
                            <Box display="flex" justifyContent="center" flexWrap="wrap">
                                {player.cards.map((card, index) => (
                                    <Fade key={index} in={true} timeout={500 + index * 200}>
                                        <Box>
                                            {renderCard(card)}
                                        </Box>
                                    </Fade>
                                ))}
                            </Box>
                        </Box>

                        {/* Game Actions */}
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                onClick={hit}
                                disabled={player.isBusted}
                                aria-label="Hit - draw another card"
                                sx={{
                                    bgcolor: '#2effbf',
                                    color: '#181f32',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#1effaf' },
                                }}
                            >
                                Hit
                            </Button>
                            <Button
                                variant="contained"
                                onClick={stand}
                                disabled={player.isBusted}
                                aria-label="Stand - end your turn"
                                sx={{
                                    bgcolor: '#ffe53b',
                                    color: '#181f32',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#ffd700' },
                                }}
                            >
                                Stand
                            </Button>
                        </Box>
                    </Box>
                )}

                {gameState === 'gameOver' && (
                    <Box textAlign="center">
                        <Typography variant="h5" mb={3} sx={{ color: '#2effbf' }}>
                            {gameResult}
                        </Typography>

                        {/* Final Hands */}
                        <Grid container spacing={3} mb={4}>
                            <Grid item xs={6}>
                                <Typography variant="h6" mb={2} sx={{ color: '#ffe53b' }}>
                                    Dealer ({dealer.score})
                                </Typography>
                                <Box display="flex" justifyContent="center" flexWrap="wrap">
                                    {dealer.cards.map((card, index) => (
                                        <Box key={index}>{renderCard(card)}</Box>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" mb={2} sx={{ color: '#2effbf' }}>
                                    Player ({player.score})
                                </Typography>
                                <Box display="flex" justifyContent="center" flexWrap="wrap">
                                    {player.cards.map((card, index) => (
                                        <Box key={index}>{renderCard(card)}</Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" mb={3} sx={{ color: '#ffe53b' }}>
                            New Balance: ${balance}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                {gameState === 'playing' && (
                    <Button
                        variant="outlined"
                        onClick={resetGame}
                        aria-label="Quit current game"
                        sx={{
                            color: '#2effbf',
                            borderColor: '#2effbf',
                            '&:hover': { borderColor: '#1effaf' },
                        }}
                    >
                        Quit Game
                    </Button>
                )}

                {gameState === 'gameOver' && (
                    <Button
                        variant="contained"
                        onClick={startGame}
                        aria-label="Play another game"
                        sx={{
                            bgcolor: '#2effbf',
                            color: '#181f32',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#1effaf' },
                        }}
                    >
                        Play Again
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BlackJackGame; 