'use client'

import * as React from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: unknown) => {
                // Don't retry on CORS errors or network failures
                const errorMessage = error && typeof error === 'object' && 'message' in error
                    ? String(error.message)
                    : '';

                if (errorMessage.includes('CORS') ||
                    errorMessage.includes('Failed to fetch') ||
                    errorMessage.includes('NetworkError') ||
                    errorMessage.includes('ERR_FAILED') ||
                    errorMessage.includes('ERR_ABORTED')) {
                    return false
                }
                // Retry up to 2 times for other errors (reduced from 3)
                return failureCount < 2
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            // Add network mode to prevent unnecessary requests
            networkMode: 'online',
        },
        mutations: {
            retry: false, // Don't retry mutations
        },
    },
})

const WagmiProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
                // Disable analytics to prevent Coinbase tracking errors
                showRecentTransactions={false}
                // Disable automatic wallet connection
                initialChain={undefined}
                // Disable analytics tracking
                enableAnalytics={false}
            >
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
)

export { WagmiProviderWrapper } 