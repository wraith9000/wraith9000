import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Web3State {
    isConnected: boolean;
    account: string | null;
    chainId: number | null;
    balance: string | null;
    error: string | null;
}

interface StakingContract {
    stake: (amount: string) => Promise<void>;
    unstake: (amount: string) => Promise<void>;
    claimRewards: () => Promise<void>;
    getStakingInfo: () => Promise<any>;
}

interface Web3ContextType {
    isConnected: boolean;
    account: string | null;
    chainId: number | null;
    balance: string | null;
    error: string | null;
    stakingContract: StakingContract | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3Context = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3Context must be used within a Web3Provider');
    }
    return context;
};

interface Web3ProviderProps {
    children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    const [web3State, setWeb3State] = useState<Web3State>({
        isConnected: false,
        account: null,
        chainId: null,
        balance: null,
        error: null,
    });

    const [stakingContract, setStakingContract] = useState<StakingContract | null>(null);

    // Mock contract functions - replace with actual contract calls
    const mockStakingContract: StakingContract = {
        stake: async (amount: string) => {
            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`Staking ${amount} tokens`);
        },
        unstake: async (amount: string) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`Unstaking ${amount} tokens`);
        },
        claimRewards: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Claiming rewards');
        },
        getStakingInfo: async () => {
            return {
                totalStaked: '1,234,567',
                totalRewards: '89,123',
                apy: '12.5',
                userStaked: '0',
                userRewards: '0',
                lockPeriod: '30 days',
            };
        },
    };

    const connectWallet = useCallback(async () => {
        try {
            // Check if MetaMask is installed
            if (typeof window !== 'undefined' && window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                if (accounts.length > 0) {
                    const chainId = await window.ethereum.request({
                        method: 'eth_chainId',
                    });

                    setWeb3State({
                        isConnected: true,
                        account: accounts[0],
                        chainId: parseInt(chainId, 16),
                        balance: null,
                        error: null,
                    });

                    setStakingContract(mockStakingContract);
                }
            } else {
                setWeb3State(prev => ({
                    ...prev,
                    error: 'MetaMask not found. Please install MetaMask to use this feature.',
                }));
            }
        } catch (error) {
            setWeb3State(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to connect wallet',
            }));
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setWeb3State({
            isConnected: false,
            account: null,
            chainId: null,
            balance: null,
            error: null,
        });
        setStakingContract(null);
    }, []);

    const getBalance = useCallback(async () => {
        if (web3State.account && window.ethereum) {
            try {
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [web3State.account, 'latest'],
                });

                setWeb3State(prev => ({
                    ...prev,
                    balance: (parseInt(balance, 16) / 1e18).toFixed(4),
                }));
            } catch (error) {
                console.error('Failed to get balance:', error);
            }
        }
    }, [web3State.account]);

    // Listen for account changes
    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setWeb3State(prev => ({
                        ...prev,
                        account: accounts[0],
                    }));
                }
            };

            const handleChainChanged = (chainId: string) => {
                setWeb3State(prev => ({
                    ...prev,
                    chainId: parseInt(chainId, 16),
                }));
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [disconnectWallet]);

    // Check if wallet is already connected on mount
    useEffect(() => {
        const checkExistingConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });

                    if (accounts.length > 0) {
                        const chainId = await window.ethereum.request({
                            method: 'eth_chainId',
                        });

                        setWeb3State({
                            isConnected: true,
                            account: accounts[0],
                            chainId: parseInt(chainId, 16),
                            balance: null,
                            error: null,
                        });

                        setStakingContract(mockStakingContract);
                    }
                } catch (error) {
                    console.error('Failed to check existing connection:', error);
                }
            }
        };

        checkExistingConnection();
    }, []);

    // Get balance when account changes
    useEffect(() => {
        if (web3State.isConnected) {
            getBalance();
        }
    }, [web3State.isConnected, getBalance]);

    const value: Web3ContextType = {
        ...web3State,
        stakingContract,
        connectWallet,
        disconnectWallet,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};

// Add ethereum to window type
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (...args: any[]) => void) => void;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
        };
    }
} 