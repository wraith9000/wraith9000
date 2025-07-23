import React from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '../components/wraith9000/BaseLayout'
import SEOHead from '../components/SEOHead'

const Custom404: React.FC = () => {
  const router = useRouter()

  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Wraith9000"
        description="The page you're looking for doesn't exist. Return to Wraith9000 homepage."
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
            404
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Page Not Found
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
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
            Return to Homepage
          </button>
        </div>
      </BaseLayout>
    </>
  )
}

export default Custom404 