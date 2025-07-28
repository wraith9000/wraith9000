import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Alert,
    Snackbar,
    Chip,
} from '@mui/material';
import BaseLayout from '../components/wraith9000/BaseLayout';
import Section from '../components/wraith9000/Section';
import SectionHeader from '../components/wraith9000/SectionHeader';
import SEOHead from '../components/SEOHead';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import { useWeb3Context } from '../hooks/Web3Context';

const StakingPage: React.FC = () => {
    const { isConnected, account, connectWallet, disconnectWallet, stakingContract, error } = useWeb3Context();
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [stakingData, setStakingData] = useState({
        totalStaked: '0',
        totalRewards: '89,123',
        apy: '30',
        userStaked: '0',
        userRewards: '0',
        lockPeriod: 'No lock period',
        nextClaimDate: 'Available Now',
        claimInterval: 'Instant',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleConnectWallet = async () => {
        try {
            await connectWallet();
            setSnackbarMessage('Wallet connected successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch {
            setSnackbarMessage(error || 'Failed to connect wallet');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleStake = async () => {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            setSnackbarMessage('Please enter a valid amount to stake');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!stakingContract) {
            setSnackbarMessage('Please connect your wallet first');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            await stakingContract.stake(stakeAmount);
            setSnackbarMessage('Staking transaction submitted!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setStakeAmount('');
        } catch {
            setSnackbarMessage('Failed to stake tokens');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnstake = async () => {
        if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
            setSnackbarMessage('Please enter a valid amount to unstake');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!stakingContract) {
            setSnackbarMessage('Please connect your wallet first');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            await stakingContract.unstake(unstakeAmount);
            setSnackbarMessage('Unstaking transaction submitted!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setUnstakeAmount('');
        } catch {
            setSnackbarMessage('Failed to unstake tokens');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!stakingContract) {
            setSnackbarMessage('Please connect your wallet first');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            await stakingContract.claimRewards();
            setSnackbarMessage('Rewards claimed successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch {
            setSnackbarMessage('Failed to claim rewards');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Load staking data when connected
    useEffect(() => {
        const loadStakingData = async () => {
            if (stakingContract) {
                try {
                    const data = await stakingContract.getStakingInfo();
                    setStakingData(data);
                } catch {
                    // Silently handle error - could be network issues or contract not available
                }
            }
        };

        loadStakingData();
    }, [stakingContract]);

    return (
        <>
            <SEOHead
                title="Staking - Wraith9000"
                description="Stake your tokens and earn rewards in the Wraith9000 ecosystem"
            />
            <BaseLayout>
                <Section>
                    <Container maxWidth="lg">
                        <SectionHeader
                            title="Staking"
                            subtitle="Stake your tokens and earn rewards"
                        />

                        {/* Connect Wallet Section */}
                        {!isConnected && (
                            <Card sx={{ mb: 4, bgcolor: 'rgba(255, 229, 59, 0.1)', border: '2px solid #ffe53b' }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 64, color: '#ffe53b', mb: 2 }} />
                                    <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                        Connect Your Wallet
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                                        Connect your wallet to start staking tokens
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        startIcon={<AccountBalanceWalletRoundedIcon />}
                                        onClick={handleConnectWallet}
                                        sx={{
                                            bgcolor: '#ffe53b',
                                            color: '#181f32',
                                            fontFamily: 'Sarpanch, sans-serif',
                                            fontWeight: 900,
                                            borderRadius: '20px',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: 18,
                                            letterSpacing: 1,
                                            textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: '#ffe53b',
                                                opacity: 0.92,
                                            },
                                        }}
                                    >
                                        Connect Wallet
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {isConnected && (
                            <>
                                {/* Account Info */}
                                <Card sx={{ mb: 4, bgcolor: 'rgba(46, 255, 191, 0.1)', border: '1px solid #2effbf' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ color: '#2effbf', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    Connected Wallet
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                onClick={disconnectWallet}
                                                sx={{
                                                    borderColor: '#ff6b6b',
                                                    color: '#ff6b6b',
                                                    fontFamily: 'Sarpanch, sans-serif',
                                                    fontWeight: 900,
                                                    '&:hover': {
                                                        borderColor: '#ff6b6b',
                                                        bgcolor: 'rgba(255, 107, 107, 0.1)',
                                                    },
                                                }}
                                            >
                                                Disconnect
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Staking Stats */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={3}>
                                        <Card sx={{ bgcolor: 'rgba(255, 229, 59, 0.1)', border: '1px solid #ffe53b' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#ffe53b', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    Total Staked
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    {stakingData.totalStaked}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card sx={{ bgcolor: 'rgba(46, 255, 191, 0.1)', border: '1px solid #2effbf' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#2effbf', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    APY
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    {stakingData.apy}%
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card sx={{ bgcolor: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#ff6b6b', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    Your Staked
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    {stakingData.userStaked}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card sx={{ bgcolor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#ffc107', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    Your Rewards
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    {stakingData.userRewards}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Staking Actions */}
                                <Grid container spacing={4}>
                                    {/* Stake */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ bgcolor: 'rgba(255, 229, 59, 0.05)', border: '1px solid #ffe53b' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <LockIcon sx={{ color: '#ffe53b', mr: 1 }} />
                                                    <Typography variant="h6" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                        Stake Tokens
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    label="Amount to stake"
                                                    type="number"
                                                    value={stakeAmount}
                                                    onChange={(e) => setStakeAmount(e.target.value)}
                                                    sx={{ mb: 2 }}
                                                    InputProps={{
                                                        endAdornment: <Chip label="Tokens" size="small" sx={{ bgcolor: '#ffe53b' }} />,
                                                    }}
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={handleStake}
                                                    disabled={isLoading}
                                                    sx={{
                                                        bgcolor: '#ffe53b',
                                                        color: '#181f32',
                                                        fontFamily: 'Sarpanch, sans-serif',
                                                        fontWeight: 900,
                                                        borderRadius: '20px',
                                                        py: 1.5,
                                                        fontSize: 16,
                                                        letterSpacing: 1,
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            bgcolor: '#ffe53b',
                                                            opacity: 0.92,
                                                        },
                                                        '&:disabled': {
                                                            bgcolor: '#ffe53b',
                                                            opacity: 0.5,
                                                        },
                                                    }}
                                                >
                                                    {isLoading ? 'Processing...' : 'Stake Tokens'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Unstake */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ bgcolor: 'rgba(255, 107, 107, 0.05)', border: '1px solid #ff6b6b' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <TimerIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                                                    <Typography variant="h6" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                        Unstake Tokens
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    label="Amount to unstake"
                                                    type="number"
                                                    value={unstakeAmount}
                                                    onChange={(e) => setUnstakeAmount(e.target.value)}
                                                    sx={{ mb: 2 }}
                                                    InputProps={{
                                                        endAdornment: <Chip label="Tokens" size="small" sx={{ bgcolor: '#ff6b6b' }} />,
                                                    }}
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={isLoading}
                                                    sx={{
                                                        bgcolor: '#ff6b6b',
                                                        color: 'white',
                                                        fontFamily: 'Sarpanch, sans-serif',
                                                        fontWeight: 900,
                                                        borderRadius: '20px',
                                                        py: 1.5,
                                                        fontSize: 16,
                                                        letterSpacing: 1,
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            bgcolor: '#ff6b6b',
                                                            opacity: 0.92,
                                                        },
                                                        '&:disabled': {
                                                            bgcolor: '#ff6b6b',
                                                            opacity: 0.5,
                                                        },
                                                    }}
                                                    onClick={handleUnstake}
                                                >
                                                    {isLoading ? 'Processing...' : 'Unstake Tokens'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Claim Rewards */}
                                <Card sx={{ mt: 4, bgcolor: 'rgba(255, 193, 7, 0.05)', border: '1px solid #ffc107' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TrendingUpIcon sx={{ color: '#ffc107', mr: 1 }} />
                                                <Typography variant="h6" sx={{ fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}>
                                                    Claim Rewards
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label="Instant Claims"
                                                sx={{ bgcolor: '#2effbf', color: '#181f32', fontFamily: 'Sarpanch, sans-serif', fontWeight: 900 }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                            Claim your accumulated staking rewards instantly. Rewards are available immediately.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            disabled={isLoading}
                                            sx={{
                                                bgcolor: '#ffc107',
                                                color: '#181f32',
                                                fontFamily: 'Sarpanch, sans-serif',
                                                fontWeight: 900,
                                                borderRadius: '20px',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: 16,
                                                letterSpacing: 1,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    bgcolor: '#ffc107',
                                                    opacity: 0.92,
                                                },
                                                '&:disabled': {
                                                    bgcolor: '#ffc107',
                                                    opacity: 0.5,
                                                },
                                            }}
                                            onClick={handleClaimRewards}
                                        >
                                            {isLoading ? 'Processing...' : 'Claim Rewards'}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Error Alert */}
                                {error && (
                                    <Alert severity="error" sx={{ mt: 4, fontFamily: 'Sarpanch, sans-serif' }}>
                                        <Typography variant="body2">
                                            <strong>Error:</strong> {error}
                                        </Typography>
                                    </Alert>
                                )}

                                {/* Info Alert */}
                                <Alert severity="info" sx={{ mt: 4, fontFamily: 'Sarpanch, sans-serif' }}>
                                    <Typography variant="body2">
                                        <strong>Important:</strong> You can unstake your tokens anytime with no lock period.
                                        Rewards are available for immediate claiming based on your staked amount and the current APY.
                                    </Typography>
                                </Alert>
                            </>
                        )}
                    </Container>
                </Section>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{
                            fontFamily: 'Sarpanch, sans-serif',
                            fontWeight: 900,
                            fontSize: 16,
                            letterSpacing: 1,
                        }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </BaseLayout>
        </>
    );
};

export default StakingPage; 