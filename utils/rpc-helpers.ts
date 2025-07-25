// RPC endpoint fallbacks
export const RPC_FALLBACKS = {
    mainnet: [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://ethereum.publicnode.com'
    ],
    polygon: [
        'https://polygon.llamarpc.com',
        'https://rpc.ankr.com/polygon',
        'https://polygon-rpc.com'
    ],
    optimism: [
        'https://optimism.llamarpc.com',
        'https://rpc.ankr.com/optimism',
        'https://mainnet.optimism.io'
    ],
    arbitrum: [
        'https://arbitrum.llamarpc.com',
        'https://rpc.ankr.com/arbitrum',
        'https://arb1.arbitrum.io/rpc'
    ],
    base: [
        'https://base.llamarpc.com',
        'https://mainnet.base.org',
        'https://base.blockpi.network/v1/rpc/public'
    ],
    zora: [
        'https://rpc.zora.energy',
        'https://rpc.zora.co'
    ],
    avalanche: [
        'https://api.avax.network/ext/bc/C/rpc',
        'https://rpc.ankr.com/avalanche',
        'https://avalanche.public-rpc.com'
    ]
}

// Error types that should trigger fallback
export const FALLBACK_ERRORS = [
    'CORS',
    'Failed to fetch',
    'NetworkError',
    'ERR_FAILED',
    'ERR_ABORTED',
    'timeout',
    'ECONNREFUSED',
    'ENOTFOUND'
]

// Check if an error should trigger fallback
export const shouldUseFallback = (error: unknown): boolean => {
    const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : String(error)

    return FALLBACK_ERRORS.some(fallbackError =>
        errorMessage.toLowerCase().includes(fallbackError.toLowerCase())
    )
}

// Get next fallback endpoint
export const getNextFallback = (chainName: keyof typeof RPC_FALLBACKS, currentIndex: number): string | null => {
    const fallbacks = RPC_FALLBACKS[chainName]
    return currentIndex < fallbacks.length - 1 ? fallbacks[currentIndex + 1] : null
}

// Retry with exponential backoff
export const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> => {
    let lastError: unknown

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error

            if (i === maxRetries - 1) {
                throw error
            }

            // Wait with exponential backoff
            const delay = baseDelay * Math.pow(2, i)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    throw lastError
} 