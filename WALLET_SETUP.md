# Wagmi Wallet Integration

This project now includes Wagmi wallet integration with RainbowKit for easy wallet connections.

## Features

- **Multi-chain Support**: Supports Avalanche C-Chain, Ethereum, Polygon, Optimism, Arbitrum, Base, and Zora
- **RainbowKit UI**: Beautiful, accessible wallet connection interface
- **Custom Styling**: Matches your app's theme with yellow accent color (#ffe53b)
- **Mobile Responsive**: Works perfectly on mobile devices
- **Wallet Info Display**: Shows connected wallet address, chain, and balance

## Configuration

The wallet integration is configured in `config/wagmi.ts` with your project ID:
- **Project ID**: `0456b2785d82f349a226550c56afbad0`
- **App Name**: Wraith9000
- **Supported Chains**: Avalanche C-Chain, Mainnet, Polygon, Optimism, Arbitrum, Base, Zora

## Components

### ConnectButton
Located in `components/CustomNavigation.tsx`, the ConnectButton appears in two places:
- **Desktop**: Top-right corner of the screen
- **Mobile**: Inside the mobile navigation drawer

### WalletInfo
Located in `components/WalletInfo.tsx`, displays wallet information when connected:
- Wallet address (truncated)
- Current chain
- Token balance

## Custom Hook

### useWallet
Located in `hooks/useWallet.ts`, provides easy access to wallet data:

```typescript
import { useWallet } from '../hooks/useWallet'

function MyComponent() {
  const { address, isConnected, chain, balance } = useWallet()
  
  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }
  
  return (
    <div>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
    </div>
  )
}
```

## Styling

Custom styles are applied in `styles/rainbowkit-custom.css` to match your app's theme:
- Yellow accent color (#ffe53b)
- Sarpanch font family
- Rounded corners and blur effects
- Hover animations

## Usage Examples

### Reading Wallet Data
```typescript
import { useAccount, useBalance, useNetwork } from 'wagmi'

function MyComponent() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: balance } = useBalance({ address })
  
  // Your component logic here
}
```

### Writing to Blockchain
```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function MyComponent() {
  const { data: hash, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  
  const handleTransaction = () => {
    writeContract({
      address: '0x...',
      abi: [...],
      functionName: 'transfer',
      args: ['0x...', 1000000000000000000n]
    })
  }
}
```

## Dependencies

- `wagmi`: Core wallet functionality
- `viem`: Ethereum interaction library
- `@rainbow-me/rainbowkit`: UI components
- `@tanstack/react-query`: Data fetching

## Next Steps

1. **Add Contract Interactions**: Use `useReadContract` and `useWriteContract` for smart contract calls
2. **Add Transaction History**: Implement transaction tracking
3. **Add Network Switching**: Allow users to switch between supported chains
4. **Add Token Lists**: Display user's token balances
5. **Add NFT Support**: Show user's NFT collections

## Troubleshooting

- **Wallet not connecting**: Ensure you're using a supported wallet (MetaMask, WalletConnect, etc.)
- **Wrong network**: Users can switch networks using the chain selector
- **Styling issues**: Check that `rainbowkit-custom.css` is properly imported
- **Build errors**: Ensure all dependencies are installed with `npm install` 