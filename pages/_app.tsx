/* eslint-disable max-len */
/* eslint-disable @next/next/no-page-custom-font */
import * as React from 'react'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.scss'
import { AppProps } from 'next/dist/shared/lib/router/router'
import ReactGA from 'react-ga'
import CustomNavigation from '../components/CustomNavigation'
import { SEO } from '../config'
import Frame from '../components/Frame'
import ThemeProvider from '../components/wraith9000/ThemeProvider'
import MobileOptimizer from '../components/MobileOptimizer'

const YOUR_TRACKING_ID = 'G-YTZ512CCQL'

const App: React.FC<AppProps> = (props) => {
  const { pageProps, Component } = props

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactGA.initialize(`${YOUR_TRACKING_ID}`)
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }, [])

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{SEO.title}</title>
        <meta name='viewport' content='initial-scale=1, width=device-width, viewport-fit=cover, user-scalable=no' />
        <meta name='description' content={SEO.description} />
        <meta name='keywords' content={SEO.keywords} />
        <meta name='author' content={SEO.author} />
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />

        {/* Canonical URL */}
        <link rel='canonical' href={SEO.openGraph.url} />

        {/* Open Graph Meta Tags */}
        <meta property='og:type' content={SEO.openGraph.type} />
        <meta property='og:title' content={SEO.openGraph.title} />
        <meta property='og:description' content={SEO.openGraph.description} />
        <meta property='og:url' content={SEO.openGraph.url} />
        <meta property='og:image' content={SEO.openGraph.image} />
        <meta property='og:image:width' content={SEO.openGraph.imageWidth?.toString()} />
        <meta property='og:image:height' content={SEO.openGraph.imageHeight?.toString()} />
        <meta property='og:site_name' content={SEO.openGraph.siteName} />
        <meta property='og:locale' content={SEO.openGraph.locale} />

        {/* Twitter Card Meta Tags */}
        <meta name='twitter:card' content={SEO.twitter.card} />
        <meta name='twitter:site' content={SEO.twitter.site} />
        <meta name='twitter:creator' content={SEO.twitter.creator} />
        <meta name='twitter:title' content={SEO.twitter.title} />
        <meta name='twitter:description' content={SEO.twitter.description} />
        <meta name='twitter:image' content={SEO.twitter.image} />

        {/* Mobile-specific Meta Tags */}
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
        <meta name='apple-mobile-web-app-title' content='Wraith9000' />
        <meta name='application-name' content='Wraith9000' />
        <meta name='msapplication-TileColor' content='#2effbf' />
        <meta name='msapplication-config' content='/favicon/browserconfig.xml' />
        <meta name='theme-color' content='#1a253d' />
        <meta name='msapplication-TileColor' content='#1a253d' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />

        {/* Preconnect for Performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://www.googletagmanager.com' />
        <link rel='preconnect' href='https://cdn.jsdelivr.net' />

        {/* DNS Prefetch for External Resources */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//www.googletagmanager.com' />
        <link rel='dns-prefetch' href='//cdn.jsdelivr.net' />

        {/* Structured Data */}
        <script
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SEO.structuredData),
          }}
        />
        <script
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SEO.gameStructuredData),
          }}
        />
      </Head>

      {/* External Scripts */}
      <Script
        src='https://cdn.jsdelivr.net/npm/soonaverse@0.1.10/dist/soon.js'
        strategy='lazyOnload'
        onError={(e) => {
          // eslint-disable-next-line no-console
          console.warn('Failed to load Soonaverse script:', e);
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${YOUR_TRACKING_ID}`}
        strategy='afterInteractive'
      />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${YOUR_TRACKING_ID}');`,
        }}
      />

      <ThemeProvider>
        <MobileOptimizer>
          <Frame />
          <CustomNavigation />
          <Component {...pageProps} />
        </MobileOptimizer>
      </ThemeProvider>
    </>
  )
}

export default App
