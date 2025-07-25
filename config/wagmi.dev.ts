import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, zora, avalanche } from 'wagmi/chains'
import { http } from 'wagmi'

// CORS-friendly RPC endpoints for development
const devRpcEndpoints = {
    mainnet: 'https://eth.llamarpc.com',
    polygon: 'https://polygon.llamarpc.com',
    optimism: 'https://optimism.llamarpc.com',
    arbitrum: 'https://arbitrum.llamarpc.com',
    base: 'https://base.llamarpc.com',
    zora: 'https://rpc.zora.energy',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc'
}

// Helper function to create chain configuration
const createDevChainConfig = (chain: any, rpcUrl: string) => ({
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
})

export const devConfig = getDefaultConfig({
    appName: 'Wraith9000',
    projectId: '0456b2785d82f349a226550c56afbad0',
    chains: [
        createDevChainConfig(avalanche, devRpcEndpoints.avalanche),
        createDevChainConfig(mainnet, devRpcEndpoints.mainnet),
        createDevChainConfig(polygon, devRpcEndpoints.polygon),
        createDevChainConfig(optimism, devRpcEndpoints.optimism),
        createDevChainConfig(arbitrum, devRpcEndpoints.arbitrum),
        createDevChainConfig(base, devRpcEndpoints.base),
        createDevChainConfig(zora, devRpcEndpoints.zora),
    ],
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
}) 