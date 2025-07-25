import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        const { hasError } = this.state
        const { children, fallback } = this.props

        if (hasError) {
            if (fallback) {
                return fallback
            }

            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#ff6b6b',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    margin: '20px'
                }}>
                    <h3>Something went wrong</h3>
                    <p>Please try refreshing the page or connecting your wallet again.</p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )
        }

        return children
    }
}

export default ErrorBoundary 