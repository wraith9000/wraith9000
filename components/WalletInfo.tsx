'use client'

import * as React from 'react'
import { useWallet } from '../hooks/useWallet'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

const WalletInfo: React.FC = () => {
    const { address, isConnected, chain, balance } = useWallet()

    if (!isConnected) {
        return null
    }

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                p: 2,
                bgcolor: 'rgba(26, 37, 61, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#fff',
                fontFamily: 'Sarpanch, sans-serif',
                zIndex: 1200,
                maxWidth: 300,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                Wallet Info
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-all' }}>
                <strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Chain:</strong> {chain?.name}
            </Typography>
            <Typography variant="body2">
                <strong>Balance:</strong> {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </Typography>
        </Paper>
    )
}

export default WalletInfo 