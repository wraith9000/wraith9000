import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, zora, avalanche } from 'wagmi/chains'
import { http } from 'wagmi'
import type { Chain } from 'viem'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// CORS-friendly RPC endpoints that work reliably in production
const productionRpcEndpoints = {
    mainnet: 'https://eth.llamarpc.com',
    polygon: 'https://polygon.llamarpc.com',
    optimism: 'https://optimism.llamarpc.com',
    arbitrum: 'https://arbitrum.llamarpc.com',
    base: 'https://base.llamarpc.com',
    zora: 'https://rpc.zora.energy',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc'
}

// Development-specific endpoints (same as production for now)
const developmentRpcEndpoints = {
    mainnet: 'https://eth.llamarpc.com',
    polygon: 'https://polygon.llamarpc.com',
    optimism: 'https://optimism.llamarpc.com',
    arbitrum: 'https://arbitrum.llamarpc.com',
    base: 'https://base.llamarpc.com',
    zora: 'https://rpc.zora.energy',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc'
}

// Use appropriate endpoints based on environment
const rpcEndpoints = isDevelopment ? developmentRpcEndpoints : productionRpcEndpoints

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
        createChainConfig(avalanche, rpcEndpoints.avalanche),
        createChainConfig(mainnet, rpcEndpoints.mainnet),
        createChainConfig(polygon, rpcEndpoints.polygon),
        createChainConfig(optimism, rpcEndpoints.optimism),
        createChainConfig(arbitrum, rpcEndpoints.arbitrum),
        createChainConfig(base, rpcEndpoints.base),
        createChainConfig(zora, rpcEndpoints.zora),
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