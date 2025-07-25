import React from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '../components/wraith9000/BaseLayout'
import SEOHead from '../components/SEOHead'

const Custom500: React.FC = () => {
    const router = useRouter()

    return (
        <>
            <SEOHead
                title="500 - Server Error | Wraith9000"
                description="Something went wrong on our end. Please try again or return to Wraith9000 homepage."
            />
            <BaseLayout>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#2effbf' }}>
                        500
                    </h1>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Server Error
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
                        Something went wrong on our end. Please try again.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={() => router.reload()}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                backgroundColor: '#2effbf',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1a253d'
                                e.currentTarget.style.color = '#2effbf'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2effbf'
                                e.currentTarget.style.color = '#000'
                            }}
                        >
                            Try Again
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                backgroundColor: 'transparent',
                                color: '#2effbf',
                                border: '2px solid #2effbf',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2effbf'
                                e.currentTarget.style.color = '#000'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#2effbf'
                            }}
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </BaseLayout>
        </>
    )
}

export default Custom500 