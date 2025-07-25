module.exports = {
  reactStrictMode: true,
  images: {
    // Remove imgix loader configuration since it's not properly set up
    // Use default Next.js image optimization
    domains: [],
  },
  // Ensure proper handling of trailing slashes
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://json-rpc.evm.testnet.shimmer.network https://*.google-analytics.com https://www.google-analytics.com https://discord.com https://chillzone.fr https://pulse.walletconnect.org https://api.web3modal.org https://api.avax.network https://eth.merkle.io https://*.walletconnect.com https://*.walletconnect.org https://*.rainbow.me https://*.rainbowkit.com https://*.viem.sh https://*.wagmi.sh https://*.ethers.io https://*.alchemyapi.io https://*.infura.io https://*.quicknode.com https://*.moralis.io https://*.web3api.io https://*.web3api.com https://*.web3api.org https://*.web3api.net https://*.web3api.dev https://*.web3api.pro https://*.web3api.tech https://*.web3api.cloud https://*.web3api.studio https://*.web3api.art https://*.web3api.game https://*.web3api.app https://*.web3api.site https://*.web3api.xyz https://*.ankr.com https://mainnet.base.org https://rpc.zora.energy https://*.coinbase.com https://cca-lite.coinbase.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // HTTP Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
          },
          // Cache Control for sensitive pages
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      },
      // Additional headers for API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  }
}
