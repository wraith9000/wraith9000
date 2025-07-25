// RPC helper utilities for fallback and testing

// RPC endpoints for each chain
export const rpcEndpoints = {
    1: 'https://eth.llamarpc.com', // mainnet
    137: 'https://polygon.llamarpc.com', // polygon
    10: 'https://optimism.llamarpc.com', // optimism
    42161: 'https://arbitrum.llamarpc.com', // arbitrum
    8453: 'https://base.llamarpc.com', // base
    7777777: 'https://rpc.zora.energy', // zora
    43114: 'https://api.avax.network/ext/bc/C/rpc', // avalanche
}

// Fallback endpoints for redundancy
export const fallbackEndpoints = {
    1: [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://cloudflare-eth.com',
    ],
    137: [
        'https://polygon.llamarpc.com',
        'https://polygon-rpc.com',
        'https://rpc-mainnet.matic.network',
    ],
    10: [
        'https://optimism.llamarpc.com',
        'https://mainnet.optimism.io',
        'https://rpc.ankr.com/optimism',
    ],
    42161: [
        'https://arbitrum.llamarpc.com',
        'https://arb1.arbitrum.io/rpc',
        'https://rpc.ankr.com/arbitrum',
    ],
    8453: [
        'https://base.llamarpc.com',
        'https://mainnet.base.org',
        'https://base.blockpi.network/v1/rpc/public',
    ],
    7777777: [
        'https://rpc.zora.energy',
        'https://rpc.zora.co',
    ],
    43114: [
        'https://api.avax.network/ext/bc/C/rpc',
        'https://rpc.ankr.com/avalanche',
        'https://api.avax.network/ext/bc/C/rpc',
    ],
}

// Test RPC connection
export async function testRpcConnection(endpoint: string): Promise<boolean> {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: [],
            }),
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        return !data.error && data.result
    } catch {
        return false
    }
}

// Get working RPC endpoint for a chain
export async function getWorkingRpcEndpoint(chainId: number): Promise<string | null> {
    const endpoints = fallbackEndpoints[chainId as keyof typeof fallbackEndpoints] || [rpcEndpoints[chainId as keyof typeof rpcEndpoints]]

    for (const endpoint of endpoints) {
        if (await testRpcConnection(endpoint)) {
            return endpoint
        }
    }

    return null
}

// Test proxy endpoint
export async function testProxyEndpoint(chainId: number): Promise<boolean> {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://wraith9000-rndp.vercel.app'
    const proxyUrl = `${baseUrl}/api/rpc-proxy/${chainId}`

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: [],
            }),
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        return !data.error && data.result
    } catch {
        return false
    }
} 