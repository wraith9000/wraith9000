import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, zora, avalanche } from 'wagmi/chains'
import { http } from 'wagmi'
import type { Chain } from 'viem'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Custom RPC endpoints that work better with localhost - using more reliable providers
const customRpcEndpoints = {
    mainnet: isDevelopment ? 'https://rpc.ankr.com/eth' : undefined,
    polygon: isDevelopment ? 'https://rpc.ankr.com/polygon' : undefined,
    optimism: isDevelopment ? 'https://rpc.ankr.com/optimism' : undefined,
    arbitrum: isDevelopment ? 'https://rpc.ankr.com/arbitrum' : undefined,
    base: isDevelopment ? 'https://mainnet.base.org' : undefined,
    zora: isDevelopment ? 'https://rpc.zora.energy' : undefined,
    avalanche: isDevelopment ? 'https://api.avax.network/ext/bc/C/rpc' : undefined
}

// Helper function to create chain configuration
const createChainConfig = (chain: Chain, rpcUrl?: string): Chain => {
    if (!rpcUrl) return chain

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

// Use development config if in development mode
const baseConfig = {
    appName: 'Wraith9000',
    projectId: '0456b2785d82f349a226550c56afbad0',
    chains: [
        createChainConfig(avalanche, customRpcEndpoints.avalanche),
        createChainConfig(mainnet, customRpcEndpoints.mainnet),
        createChainConfig(polygon, customRpcEndpoints.polygon),
        createChainConfig(optimism, customRpcEndpoints.optimism),
        createChainConfig(arbitrum, customRpcEndpoints.arbitrum),
        createChainConfig(base, customRpcEndpoints.base),
        createChainConfig(zora, customRpcEndpoints.zora),
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