import type { NextApiRequest, NextApiResponse } from 'next'

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    const { endpoint, chainId } = req.body

    if (!endpoint || !chainId) {
        res.status(400).json({ error: 'Missing endpoint or chainId' })
        return
    }

    try {
        // Forward the request to the RPC endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body.data || req.body),
        })

        const data = await response.json()

        // Set CORS headers
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value)
        })

        res.status(response.status).json(data)
    } catch {
        // Handle error without console.log to avoid ESLint warning
        res.status(500).json({ error: 'Internal server error' })
    }
} 