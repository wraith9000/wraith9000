import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon.ico' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon.ico' />
          <link rel='icon' type='image/png' sizes='192x192' href='/favicon/android-chrome-192x192.png' />
          <link rel='icon' type='image/png' sizes='384x384' href='/favicon/android-chrome-384x384.png' />
          <link rel='mask-icon' href='/favicon/safari-pinned-tab.svg' color='#20c593' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Sarpanch:wght@800&display=swap'
            rel='stylesheet'
          />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta name='theme-color' content='#ffffff' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument 