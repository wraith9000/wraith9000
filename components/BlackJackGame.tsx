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
    Slide,
    Tooltip,
    Alert,
    LinearProgress,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Close as CloseIcon,
    Info as InfoIcon,
    TrendingUp as TrendingUpIcon,
    Casino as CasinoIcon,
    Psychology as PsychologyIcon,
    VolumeUp as VolumeUpIcon,
    VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';

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

interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesPushed: number;
    totalWinnings: number;
    biggestWin: number;
    currentStreak: number;
    bestStreak: number;
}

interface BlackJackGameProps {
    open?: boolean;
    onClose?: () => void;
}

const BlackJackGame: React.FC<BlackJackGameProps> = ({ open = false, onClose }) => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver' | 'stats' | 'rules'>('menu');
    const [player, setPlayer] = useState<Player>({ cards: [], score: 0, isBusted: false });
    const [dealer, setDealer] = useState<Player>({ cards: [], score: 0, isBusted: false });
    const [deck, setDeck] = useState<Card[]>([]);
    const [gameResult, setGameResult] = useState<string>('');
    const [bet, setBet] = useState<number>(100);
    const [balance, setBalance] = useState<number>(1000);
    const [isDealerRevealed, setIsDealerRevealed] = useState<boolean>(false);
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [showStrategyHint, setShowStrategyHint] = useState<boolean>(false);
    const [gameStats, setGameStats] = useState<GameStats>({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesPushed: 0,
        totalWinnings: 0,
        biggestWin: 0,
        currentStreak: 0,
        bestStreak: 0,
    });
    const [currentWinStreak, setCurrentWinStreak] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [achievements, setAchievements] = useState<string[]>([]);

    // Load stats from localStorage
    useEffect(() => {
        const savedStats = localStorage.getItem('blackjack-stats');
        if (savedStats) {
            setGameStats(JSON.parse(savedStats));
        }
        const savedBalance = localStorage.getItem('blackjack-balance');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
    }, []);

    // Save stats to localStorage
    const saveStats = (newStats: GameStats) => {
        setGameStats(newStats);
        localStorage.setItem('blackjack-stats', JSON.stringify(newStats));
    };

    const saveBalance = (newBalance: number) => {
        setBalance(newBalance);
        localStorage.setItem('blackjack-balance', newBalance.toString());
    };

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

    const quickBet = (amount: number) => {
        if (amount <= balance && amount <= 500 && amount >= 50) {
            setBet(amount);
            playChipSound();
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
        if (!audioContextRef.current || !soundEnabled) return;

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

    const playChipSound = () => {
        // Chip sound - metallic clink
        generateSound(300, 0.1, 'triangle');
        setTimeout(() => generateSound(400, 0.1, 'triangle'), 50);
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

    // Strategy hint calculation
    const getStrategyHint = (): string => {
        if (player.cards.length !== 2) return '';

        const playerScore = player.score;
        const dealerUpCard = dealer.cards[0];
        const dealerUpValue = dealerUpCard.numericValue === 11 ? 1 : dealerUpCard.numericValue;

        // Basic strategy hints
        if (playerScore <= 8) return 'Always hit on 8 or less';
        if (playerScore === 9 && dealerUpValue >= 3 && dealerUpValue <= 6) return 'Double down on 9 vs dealer 3-6';
        if (playerScore === 10 && dealerUpValue <= 9) return 'Double down on 10 vs dealer 2-9';
        if (playerScore === 11) return 'Always double down on 11';
        if (playerScore === 12 && (dealerUpValue >= 4 && dealerUpValue <= 6)) return 'Stand on 12 vs dealer 4-6';
        if (playerScore >= 13 && playerScore <= 16 && dealerUpValue <= 6) return 'Stand on 13-16 vs dealer 2-6';
        if (playerScore >= 17) return 'Always stand on 17 or higher';
        if (playerScore === 12 && (dealerUpValue >= 2 || dealerUpValue >= 7)) return 'Hit on 12 vs dealer 2,3,7+';
        if (playerScore >= 13 && playerScore <= 16 && dealerUpValue >= 7) return 'Hit on 13-16 vs dealer 7+';

        return 'Use your judgment';
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
        setShowStrategyHint(false);
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

    const checkAchievements = (newStats: GameStats, result: string) => {
        const newAchievements: string[] = [];

        // First win
        if (newStats.gamesWon === 1) {
            newAchievements.push('🎉 First Victory!');
        }

        // Win streak achievements
        if (newStats.currentStreak === 3) {
            newAchievements.push('🔥 Hot Streak! (3 wins)');
        }
        if (newStats.currentStreak === 5) {
            newAchievements.push('🔥🔥 On Fire! (5 wins)');
        }
        if (newStats.currentStreak === 10) {
            newAchievements.push('🔥🔥🔥 Unstoppable! (10 wins)');
        }

        // Big win achievements
        if (bet >= 200 && result === 'player_win') {
            newAchievements.push('💰 Big Spender!');
        }
        if (bet >= 500 && result === 'player_win') {
            newAchievements.push('💰💰 High Roller!');
        }

        // Perfect game (21)
        if (player.score === 21 && result === 'player_win') {
            newAchievements.push('🎯 Perfect 21!');
        }

        // Comeback (winning after being behind)
        if (result === 'player_win' && player.score < dealer.score) {
            newAchievements.push('🔄 Comeback King!');
        }

        if (newAchievements.length > 0) {
            setAchievements(newAchievements);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    const endGame = (result: string) => {
        setGameState('gameOver');
        setIsDealerRevealed(true);

        const newStats = { ...gameStats };
        newStats.gamesPlayed += 1;

        switch (result) {
            case 'bust':
                setGameResult('Bust! You lose!');
                saveBalance(balance - bet);
                playLoseSound();
                newStats.gamesLost += 1;
                setCurrentWinStreak(0);
                break;
            case 'dealer_bust':
                setGameResult('Dealer busts! You win!');
                saveBalance(balance + bet);
                playWinSound();
                newStats.gamesWon += 1;
                newStats.totalWinnings += bet;
                newStats.biggestWin = Math.max(newStats.biggestWin, bet);
                setCurrentWinStreak(prev => {
                    const newStreak = prev + 1;
                    newStats.currentStreak = newStreak;
                    newStats.bestStreak = Math.max(newStats.bestStreak, newStreak);
                    return newStreak;
                });
                checkAchievements(newStats, result);
                break;
            case 'dealer_win':
                setGameResult('Dealer wins!');
                saveBalance(balance - bet);
                playLoseSound();
                newStats.gamesLost += 1;
                setCurrentWinStreak(0);
                break;
            case 'player_win':
                setGameResult('You win!');
                saveBalance(balance + bet);
                playWinSound();
                newStats.gamesWon += 1;
                newStats.totalWinnings += bet;
                newStats.biggestWin = Math.max(newStats.biggestWin, bet);
                setCurrentWinStreak(prev => {
                    const newStreak = prev + 1;
                    newStats.currentStreak = newStreak;
                    newStats.bestStreak = Math.max(newStats.bestStreak, newStreak);
                    return newStreak;
                });
                checkAchievements(newStats, result);
                break;
            case 'push':
                setGameResult('Push! It\'s a tie!');
                newStats.gamesPushed += 1;
                break;
        }

        saveStats(newStats);
    };

    const resetGame = () => {
        playButtonSound();
        setGameState('menu');
        setPlayer({ cards: [], score: 0, isBusted: false });
        setDealer({ cards: [], score: 0, isBusted: false });
        setGameResult('');
        setIsDealerRevealed(false);
        setShowStrategyHint(false);
        onClose?.();
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
        playButtonSound();
    };

    const toggleStrategyHint = () => {
        setShowStrategyHint(!showStrategyHint);
        playButtonSound();
    };

    const renderCard = React.useMemo(() => (card: Card, isHidden: boolean = false) => (
        <Card
            role="img"
            aria-label={isHidden ? "Hidden card" : `${card.value} of ${card.suit}`}
            sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 90, sm: 105, md: 120 },
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
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(46, 255, 191, 0.4)',
                },
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
                                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' },
                            }}
                        >
                            {card.value}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: card.suit === '♥' || card.suit === '♦' ? 'red' : 'black',
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                            }}
                        >
                            {card.suit}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    ), []);

    const renderRules = () => (
        <Box>
            <Typography variant="h5" mb={3} sx={{ color: '#2effbf', textAlign: 'center' }}>
                How to Play Blackjack
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(46, 255, 191, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#2effbf', mb: 2 }}>
                            🎯 Objective
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Get as close to 21 as possible without going over. Beat the dealer's hand to win.
                        </Typography>

                        <Typography variant="h6" sx={{ color: '#2effbf', mb: 2 }}>
                            🃏 Card Values
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            • Number cards (2-10): Face value<br />
                            • Face cards (J, Q, K): 10 points<br />
                            • Aces: 1 or 11 (whichever is better)
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255, 229, 59, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#ffe53b', mb: 2 }}>
                            🎮 Actions
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            • <strong>Hit:</strong> Draw another card<br />
                            • <strong>Stand:</strong> Keep your current hand<br />
                            • <strong>Double Down:</strong> Double your bet (not available in this version)
                        </Typography>

                        <Typography variant="h6" sx={{ color: '#ffe53b', mb: 2 }}>
                            🏆 Winning
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            • Beat dealer's hand without busting<br />
                            • Dealer busts (goes over 21)<br />
                            • Push: Same score (tie)
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={() => setGameState('menu')}
                    sx={{
                        bgcolor: '#2effbf',
                        color: '#181f32',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#1effaf' },
                    }}
                >
                    Back to Menu
                </Button>
            </Box>
        </Box>
    );

    const renderStats = () => (
        <Box>
            <Typography variant="h5" mb={3} sx={{ color: '#2effbf', textAlign: 'center' }}>
                Game Statistics
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(46, 255, 191, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#2effbf' }}>
                            {gameStats.gamesPlayed}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Games Played
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 229, 59, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#ffe53b' }}>
                            {gameStats.gamesWon}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Games Won
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 100, 100, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#ff6464' }}>
                            {gameStats.gamesLost}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Games Lost
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(100, 100, 255, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#6464ff' }}>
                            {gameStats.gamesPushed}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Pushes
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(46, 255, 191, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#2effbf', mb: 1 }}>
                            Win Rate
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={gameStats.gamesPlayed > 0 ? (gameStats.gamesWon / gameStats.gamesPlayed) * 100 : 0}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: '#2effbf',
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                            {gameStats.gamesPlayed > 0 ? `${((gameStats.gamesWon / gameStats.gamesPlayed) * 100).toFixed(1)}%` : '0%'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255, 229, 59, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#ffe53b', mb: 1 }}>
                            Best Streak
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#ffe53b' }}>
                            {gameStats.bestStreak}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Consecutive Wins
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    onClick={() => setGameState('menu')}
                    sx={{
                        bgcolor: '#2effbf',
                        color: '#181f32',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#1effaf' },
                    }}
                >
                    Back to Menu
                </Button>
            </Box>
        </Box>
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
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    '& .confetti': {
                        '@keyframes confetti': {
                            '0%': {
                                transform: 'translateY(-10px) rotate(0deg)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'translateY(100vh) rotate(720deg)',
                                opacity: 0,
                            },
                        },
                        '@keyframes slideIn': {
                            '0%': {
                                transform: 'translateY(-20px)',
                                opacity: 0,
                            },
                            '100%': {
                                transform: 'translateY(0)',
                                opacity: 1,
                            },
                        },
                    },
                },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#2effbf' }}>
                        Black Jack
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Tooltip title="Toggle Sound">
                            <IconButton
                                onClick={toggleSound}
                                sx={{ color: '#2effbf' }}
                                aria-label="Toggle sound"
                            >
                                {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            onClick={resetGame}
                            sx={{ color: '#2effbf' }}
                            aria-label="Close game"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ overflow: 'auto' }}>
                {gameState === 'menu' && (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h4" mb={3} sx={{ color: '#2effbf', fontWeight: 900 }}>
                            Welcome to Black Jack!
                        </Typography>
                        <Typography variant="body1" mb={4} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Get as close to 21 as possible without going over. Beat the dealer to win!
                        </Typography>

                        {/* Quick Stats */}
                        <Box mb={4}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Chip
                                        icon={<TrendingUpIcon />}
                                        label={`Win Rate: ${gameStats.gamesPlayed > 0 ? ((gameStats.gamesWon / gameStats.gamesPlayed) * 100).toFixed(1) : 0}%`}
                                        sx={{
                                            bgcolor: 'rgba(46, 255, 191, 0.2)',
                                            color: '#2effbf',
                                            border: '1px solid #2effbf',
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Chip
                                        icon={<CasinoIcon />}
                                        label={`Games: ${gameStats.gamesPlayed}`}
                                        sx={{
                                            bgcolor: 'rgba(255, 229, 59, 0.2)',
                                            color: '#ffe53b',
                                            border: '1px solid #ffe53b',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

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

                            {/* Quick Bet Buttons */}
                            <Box display="flex" justifyContent="center" gap={1} mt={2} flexWrap="wrap">
                                {[50, 100, 200, 300, 500].map((amount) => (
                                    <Button
                                        key={amount}
                                        size="small"
                                        onClick={() => quickBet(amount)}
                                        disabled={amount > balance || amount > 500}
                                        sx={{
                                            bgcolor: bet === amount ? '#2effbf' : 'rgba(255, 229, 59, 0.2)',
                                            color: bet === amount ? '#181f32' : '#ffe53b',
                                            border: `1px solid ${bet === amount ? '#2effbf' : '#ffe53b'}`,
                                            '&:hover': {
                                                bgcolor: bet === amount ? '#1effaf' : 'rgba(255, 229, 59, 0.3)',
                                            },
                                            '&:disabled': { opacity: 0.5 },
                                        }}
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </Box>
                        </Box>

                        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
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
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => setGameState('stats')}
                                aria-label="View statistics"
                                sx={{
                                    color: '#2effbf',
                                    borderColor: '#2effbf',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    px: 4,
                                    py: 2,
                                    '&:hover': { borderColor: '#1effaf' },
                                }}
                            >
                                Statistics
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => setGameState('rules')}
                                aria-label="View game rules"
                                sx={{
                                    color: '#ffe53b',
                                    borderColor: '#ffe53b',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    px: 4,
                                    py: 2,
                                    '&:hover': { borderColor: '#ffd700' },
                                }}
                            >
                                Rules
                            </Button>
                        </Box>
                    </Box>
                )}

                {gameState === 'playing' && (
                    <Box>
                        {/* Balance and Bet */}
                        <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
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

                        {/* Strategy Hint */}
                        {player.cards.length === 2 && (
                            <Box mb={2}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={toggleStrategyHint}
                                    startIcon={<PsychologyIcon />}
                                    sx={{
                                        color: '#2effbf',
                                        borderColor: '#2effbf',
                                        '&:hover': { borderColor: '#1effaf' },
                                    }}
                                >
                                    Strategy Hint
                                </Button>
                                {showStrategyHint && (
                                    <Alert severity="info" sx={{ mt: 1, bgcolor: 'rgba(46, 255, 191, 0.1)' }}>
                                        {getStrategyHint()}
                                    </Alert>
                                )}
                            </Box>
                        )}

                        {/* Dealer Section */}
                        <Box mb={4}>
                            <Typography variant="h6" mb={2} sx={{ color: '#ffe53b' }}>
                                Dealer's Hand {isDealerRevealed && `(${dealer.score})`}
                            </Typography>
                            <Box display="flex" justifyContent="center" flexWrap="wrap">
                                {dealer.cards.map((card, index) => (
                                    <Slide key={index} direction="up" in={true} timeout={500 + index * 200}>
                                        <Box>
                                            {renderCard(card, index === 1 && !isDealerRevealed)}
                                        </Box>
                                    </Slide>
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
                                    <Slide key={index} direction="up" in={true} timeout={500 + index * 200}>
                                        <Box>
                                            {renderCard(card)}
                                        </Box>
                                    </Slide>
                                ))}
                            </Box>
                        </Box>

                        {/* Game Actions */}
                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
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
                        {/* Confetti Effect */}
                        {showConfetti && (
                            <Box
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    zIndex: 9999,
                                }}
                            >
                                {[...Array(50)].map((_, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            position: 'absolute',
                                            width: 8,
                                            height: 8,
                                            bgcolor: ['#2effbf', '#ffe53b', '#ff6464', '#6464ff'][i % 4],
                                            borderRadius: '50%',
                                            animation: `confetti ${2 + Math.random() * 3}s linear infinite`,
                                            left: `${Math.random() * 100}%`,
                                            top: '-10px',
                                            animationDelay: `${Math.random() * 2}s`,
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Achievements Display */}
                        {achievements.length > 0 && (
                            <Box mb={3}>
                                {achievements.map((achievement, index) => (
                                    <Alert
                                        key={index}
                                        severity="success"
                                        sx={{
                                            mb: 1,
                                            bgcolor: 'rgba(46, 255, 191, 0.1)',
                                            border: '1px solid #2effbf',
                                            animation: 'slideIn 0.5s ease-out',
                                        }}
                                    >
                                        {achievement}
                                    </Alert>
                                ))}
                            </Box>
                        )}

                        <Typography variant="h5" mb={3} sx={{ color: '#2effbf' }}>
                            {gameResult}
                        </Typography>

                        {/* Win Streak Display */}
                        {currentWinStreak > 0 && (
                            <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(46, 255, 191, 0.1)' }}>
                                🔥 Win Streak: {currentWinStreak} games!
                            </Alert>
                        )}

                        {/* Final Hands */}
                        <Grid container spacing={3} mb={4}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" mb={2} sx={{ color: '#ffe53b' }}>
                                    Dealer ({dealer.score})
                                </Typography>
                                <Box display="flex" justifyContent="center" flexWrap="wrap">
                                    {dealer.cards.map((card, index) => (
                                        <Box key={index}>{renderCard(card)}</Box>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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

                {gameState === 'rules' && renderRules()}

                {gameState === 'stats' && renderStats()}
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
                    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
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
                        <Button
                            variant="outlined"
                            onClick={() => setGameState('stats')}
                            aria-label="View statistics"
                            sx={{
                                color: '#2effbf',
                                borderColor: '#2effbf',
                                '&:hover': { borderColor: '#1effaf' },
                            }}
                        >
                            View Stats
                        </Button>
                    </Box>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BlackJackGame; 