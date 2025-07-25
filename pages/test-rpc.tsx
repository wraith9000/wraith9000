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

        // Use Promise.all to test all chains concurrently
        const testPromises = chains.map(async (chain) => {
            try {
                const result = await testProxyEndpoint(chain.id)
                return { id: chain.id, result }
            } catch (error) {
                // Handle error without console.log to avoid ESLint warning
                return { id: chain.id, result: false }
            }
        })

        const testResults = await Promise.all(testPromises)

        testResults.forEach(({ id, result }) => {
            newResults[id] = result
        })

        setResults(newResults)
        setTesting(false)
    }

    const getSeverity = (result: boolean | undefined) => {
        if (result === true) return 'success'
        if (result === false) return 'error'
        return 'info'
    }

    const getStatusText = (result: boolean | undefined) => {
        if (result === true) return '✅ Working'
        if (result === false) return '❌ Failed'
        return '⏳ Not tested'
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
                    severity={getSeverity(results[chain.id])}
                    sx={{ mb: 1 }}
                >
                    {chain.name} (Chain ID: {chain.id}): {getStatusText(results[chain.id])}
                </Alert>
            ))}
        </Box>
    )
}

export default TestRpcPage 