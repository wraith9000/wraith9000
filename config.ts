export const SEO = {
  title: 'Wraith9000 - Next-Gen Web3 Play-to-Earn Game on Arena.Social',
  description:
    'Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership on Arena.Social platform.',
  keywords: 'Wraith9000, Web3, NFT, Metaverse, DeFi, GameFi, Play-to-Earn, Arena.Social, Gaming, Blockchain, Crypto Gaming, NFT Skins, Dual-Token System',
  author: 'Wraith9000 Team',
  openGraph: {
    type: 'website',
    url: 'https://www.wraith9000.io',
    title: 'Wraith9000 - Next-Gen Web3 Play-to-Earn Game',
    description:
      'Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership on Arena.Social platform.',
    image: 'https://www.wraith9000.io/assets/wraith9000.png',
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
    image: 'https://www.wraith9000.io/assets/wraith9000.png',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wraith9000',
    url: 'https://www.wraith9000.io',
    description: 'Next-Gen Web3 Play-to-Earn Game on Arena.Social',
    publisher: {
      '@type': 'Organization',
      name: 'Wraith9000',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wraith9000.io/assets/wraith9000.png'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.wraith9000.io/search?q={search_term_string}',
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

export const DISCORD_CONNECT =
  'https://discord.com/api/oauth2/authorize?client_id=949687840504160267&redirect_uri=https%3A%2F%2Fwraith9000.io%2Fdiscord_connect&response_type=code&scope=identify'

export const BACKEND_URL = 'https://chillzone.fr/connect-discord'
