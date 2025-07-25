'use client'

import * as React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const ConnectWallet: React.FC = () => (
    <ConnectButton
        showBalance
        chainStatus="icon"
        accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
        }}
    />
)

export default ConnectWallet 