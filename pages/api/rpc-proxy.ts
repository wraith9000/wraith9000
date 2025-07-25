import type { NextApiRequest, NextApiResponse } from 'next'

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// RPC endpoints for each chain
const rpcEndpoints = {
    1: 'https://eth.llamarpc.com', // mainnet
    137: 'https://polygon.llamarpc.com', // polygon
    10: 'https://optimism.llamarpc.com', // optimism
    42161: 'https://arbitrum.llamarpc.com', // arbitrum
    8453: 'https://base.llamarpc.com', // base
    7777777: 'https://rpc.zora.energy', // zora
    43114: 'https://api.avax.network/ext/bc/C/rpc', // avalanche
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.status(200).end()
        return
    }

    // Only allow POST requests for RPC calls
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }

    try {
        // Extract chain ID from the request URL or body
        const url = req.url || ''
        const chainIdMatch = url.match(/\/api\/rpc-proxy\/(\d+)/)
        const chainId = chainIdMatch ? parseInt(chainIdMatch[1]) : 1 // Default to mainnet

        // Get the appropriate RPC endpoint for this chain
        const rpcEndpoint = rpcEndpoints[chainId as keyof typeof rpcEndpoints] || rpcEndpoints[1]

        // Forward the request to the RPC endpoint
        const response = await fetch(rpcEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        })

        const data = await response.json()

        // Set CORS headers
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value)
        })

        res.status(response.status).json(data)
    } catch (error) {
        console.error('RPC Proxy Error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
} 