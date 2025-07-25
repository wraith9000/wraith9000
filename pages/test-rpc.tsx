import React, { useState } from 'react'
import { Box, Button, Typography, Alert } from '@mui/material'
import { testProxyEndpoint } from '../utils/rpc-helpers'

const TestRpcPage: React.FC = () => {
    const [results, setResults] = useState<Record<number, boolean>>({})
    const [testing, setTesting] = useState(false)

    const chains = [
        { id: 1, name: 'Mainnet' },
        { id: 137, name: 'Polygon' },
        { id: 10, name: 'Optimism' },
        { id: 42161, name: 'Arbitrum' },
        { id: 8453, name: 'Base' },
        { id: 7777777, name: 'Zora' },
        { id: 43114, name: 'Avalanche' },
    ]

    const testAllChains = async () => {
        setTesting(true)
        const newResults: Record<number, boolean> = {}

        for (const chain of chains) {
            try {
                const result = await testProxyEndpoint(chain.id)
                newResults[chain.id] = result
                setResults({ ...newResults })
            } catch (error) {
                console.error(`Error testing chain ${chain.id}:`, error)
                newResults[chain.id] = false
                setResults({ ...newResults })
            }
        }

        setTesting(false)
    }

    return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                RPC Proxy Test
            </Typography>

            <Button
                variant="contained"
                onClick={testAllChains}
                disabled={testing}
                sx={{ mb: 3 }}
            >
                {testing ? 'Testing...' : 'Test All Chains'}
            </Button>

            {chains.map((chain) => (
                <Alert
                    key={chain.id}
                    severity={results[chain.id] === true ? 'success' : results[chain.id] === false ? 'error' : 'info'}
                    sx={{ mb: 1 }}
                >
                    {chain.name} (Chain ID: {chain.id}): {results[chain.id] === true ? '✅ Working' : results[chain.id] === false ? '❌ Failed' : '⏳ Not tested'}
                </Alert>
            ))}
        </Box>
    )
}

export default TestRpcPage 