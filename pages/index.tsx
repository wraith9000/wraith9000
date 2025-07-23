import React from 'react'
import BaseLayout from '../components/wraith9000/BaseLayout'
import Hero from '../sections/home/Hero'
import Metaverse from '../sections/home/Metaverse'
import SEOHead from '../components/SEOHead'
import { SEO } from '../config'

export const Home: React.FC = () => (
  <>
    <SEOHead
      title="Wraith9000 - Next-Gen Web3 Play-to-Earn Game on Arena.Social"
      description="Enter the multiverse with Wraith9000 - the next-generation Web3 play-to-earn game featuring dual-token system, NFT skins, and true player ownership on Arena.Social platform."
      structuredData={SEO.gameStructuredData}
    />
    <BaseLayout>
      <Hero />
      <Metaverse />
    </BaseLayout>
  </>
)

export default Home
