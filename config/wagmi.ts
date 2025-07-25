import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, zora, avalanche } from 'wagmi/chains'
import { http } from 'wagmi'
import type { Chain } from 'viem'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Use API proxy endpoints to avoid CORS issues
const getProxyUrl = (chainId: number) => {
    const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://wraith9000-rndp.vercel.app'
    return `${baseUrl}/api/rpc-proxy/${chainId}`
}

// Helper function to create chain configuration
const createChainConfig = (chain: Chain, rpcUrl: string): Chain => {
    return {
        ...chain,
        rpcUrls: {
            ...chain.rpcUrls,
            default: {
                http: [rpcUrl]
            },
            public: {
                http: [rpcUrl]
            }
        }
    }
}

// Base configuration with improved settings
const baseConfig = {
    appName: 'Wraith9000',
    projectId: '0456b2785d82f349a226550c56afbad0',
    chains: [
        createChainConfig(avalanche, getProxyUrl(avalanche.id)),
        createChainConfig(mainnet, getProxyUrl(mainnet.id)),
        createChainConfig(polygon, getProxyUrl(polygon.id)),
        createChainConfig(optimism, getProxyUrl(optimism.id)),
        createChainConfig(arbitrum, getProxyUrl(arbitrum.id)),
        createChainConfig(base, getProxyUrl(base.id)),
        createChainConfig(zora, getProxyUrl(zora.id)),
    ] as const,
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [zora.id]: http(),
        [avalanche.id]: http(),
    },
}

export const config = getDefaultConfig(baseConfig) 