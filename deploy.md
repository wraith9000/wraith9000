# Wraith9000 Deployment Guide

## Vercel Deployment

This project is configured for deployment on Vercel. The following files have been added/updated to ensure proper deployment:

### Files Added/Updated:

1. **vercel.json** - Vercel configuration file
2. **pages/404.tsx** - Custom 404 error page
3. **config.ts** - Updated with proper base URL handling
4. **next.config.js** - Updated with proper routing configuration

### Deployment Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Environment Variables:

The following environment variables should be set in your Vercel dashboard:

- `NEXT_PUBLIC_BASE_URL`: `https://wraith9000-rndp.vercel.app`
- `RPC_URL_WRAITH9000_EVM`: `https://json-rpc.evm.testnet.shimmer.network`

### Troubleshooting 404 Errors:

If you're still getting 404 errors after deployment:

1. **Check Vercel Dashboard**: Ensure the deployment completed successfully
2. **Verify Domain**: Make sure the domain is properly configured
3. **Clear Cache**: Try accessing the site in an incognito window
4. **Check Logs**: Review Vercel function logs for any errors

### Local Testing:

To test locally before deployment:

```bash
npm run build
npm start
```

The application should be accessible at `http://localhost:3000` 