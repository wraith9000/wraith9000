// Get the base URL from environment or default to localhost for development
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin
  }
  // Server-side: use environment variable or default
  const vercelUrl = process.env.VERCEL_URL
  const publicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  if (publicBaseUrl) {
    return publicBaseUrl
  }

  // Fallback for production deployment
  if (process.env.NODE_ENV === 'production') {
    return 'https://wraith9000-rndp.vercel.app'
  }

  return 'http://localhost:3000'
}

const baseUrl = getBaseUrl()

export const SEO = {
  title: 'Wraith9000 - Next-Gen Web3 Play-to-Earn Game on Arena.Social',
  description:
    'Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership on Arena.Social platform.',
  keywords: 'Wraith9000, Web3, NFT, Metaverse, DeFi, GameFi, Play-to-Earn, Arena.Social, Gaming, Blockchain, Crypto Gaming, NFT Skins, Dual-Token System',
  author: 'Wraith9000 Team',
  openGraph: {
    type: 'website',
    url: `${baseUrl}`,
    title: 'Wraith9000 - Next-Gen Web3 Play-to-Earn Game',
    description:
      'Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership on Arena.Social platform.',
    image: `${baseUrl}/assets/wraith9000.png`,
    imageWidth: 1200,
    imageHeight: 630,
    siteName: 'Wraith9000',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wraith9000',
    creator: '@wraith9000',
    title: 'Wraith9000 - Next-Gen Web3 Play-to-Earn Game',
    description: 'Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership.',
    image: `${baseUrl}/assets/wraith9000.png`,
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wraith9000',
    url: `${baseUrl}`,
    description: 'Next-Gen Web3 Play-to-Earn Game on Arena.Social',
    publisher: {
      '@type': 'Organization',
      name: 'Wraith9000',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/wraith9000.png`
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  },
  gameStructuredData: {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Wraith9000',
    description: 'Next-Gen Web3 Play-to-Earn Game featuring dual-token system and NFT skins',
    genre: ['Action', 'Strategy', 'Play-to-Earn'],
    platform: ['Web3', 'Blockchain'],
    publisher: 'Wraith9000',
    gamePlatform: 'Arena.Social',
    offers: {
      '@type': 'Offer',
      category: 'NFT Gaming',
      availability: 'PreOrder'
    }
  }
}


