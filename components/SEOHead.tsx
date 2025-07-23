import React from 'react'
import Head from 'next/head'
import { SEO } from '../config'

interface StructuredData {
    [key: string]: unknown;
}

interface SEOHeadProps {
    title?: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    structuredData?: StructuredData
}

const SEOHead: React.FC<SEOHeadProps> = ({
    title = SEO.title,
    description = SEO.description,
    keywords = SEO.keywords,
    image = SEO.openGraph.image,
    url = SEO.openGraph.url,
    type = 'website',
    structuredData,
}) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    // Use the image URL as provided by the config (which now uses dynamic base URL)
    const fullImage = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='author' content={SEO.author} />
            <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />

            {/* Canonical URL */}
            <link rel='canonical' href={fullUrl} />

            {/* Open Graph Meta Tags */}
            <meta property='og:type' content={type} />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:url' content={fullUrl} />
            <meta property='og:image' content={fullImage} />
            <meta property='og:image:width' content={SEO.openGraph.imageWidth?.toString()} />
            <meta property='og:image:height' content={SEO.openGraph.imageHeight?.toString()} />
            <meta property='og:site_name' content={SEO.openGraph.siteName} />
            <meta property='og:locale' content={SEO.openGraph.locale} />

            {/* Twitter Card Meta Tags */}
            <meta name='twitter:card' content={SEO.twitter.card} />
            <meta name='twitter:site' content={SEO.twitter.site} />
            <meta name='twitter:creator' content={SEO.twitter.creator} />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={description} />
            <meta name='twitter:image' content={fullImage} />

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

            {/* Structured Data */}
            {structuredData && (
                <script
                    type='application/ld+json'
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            )}
        </Head>
    )
}

export default SEOHead 