import { useAccount, useBalance, useChainId } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'

export function useWallet() {
    const { address, isConnected, isConnecting, isDisconnected } = useAccount()
    const chainId = useChainId()
    const { data: balance } = useBalance({
        address,
    })

    // Map chainId to chain object
    const chains = [mainnet, polygon, optimism, arbitrum, base, zora]
    const chain = chains.find(c => c.id === chainId)

    return {
        address,
        isConnected,
        isConnecting,
        isDisconnected,
        chain,
        balance,
    }
} 