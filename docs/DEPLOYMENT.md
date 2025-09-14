# Deployment Guide

This guide covers deployment strategies and configurations for the Soulara frontend application.

## 📋 Table of Contents

- [🌐 Overview](#-overview)
- [🔧 Environment Setup](#-environment-setup)
- [🚀 Vercel Deployment](#-vercel-deployment)
- [🔄 Alternative Platforms](#-alternative-platforms)
- [⚙️ CI/CD Pipeline](#️-cicd-pipeline)
- [🚄 Performance Optimization](#-performance-optimization)
- [📊 Monitoring & Analytics](#-monitoring--analytics)
- [🐛 Troubleshooting](#-troubleshooting)

## 🌐 Overview

The Soulara frontend is built with Next.js 15 and optimized for serverless deployment. It supports:

- **Server-Side Rendering (SSR)**
- **Static Site Generation (SSG)**
- **API Routes**
- **Edge Functions**
- **Image Optimization**

## 🔧 Environment Setup

### Environment Variables

Create environment files for different deployment stages:

```bash
# .env.local (Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# .env.production (Production)
NEXT_PUBLIC_API_URL=https://api.soulara.app
NEXT_PUBLIC_SOCKET_URL=wss://api.soulara.app
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_GOOGLE_CLIENT_ID=prod_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=prod_facebook_app_id
```

### Build Configuration

```javascript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output for static hosting
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['api.soulara.app', 'cdn.soulara.app'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@socket.io/client'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

## 🚀 Vercel Deployment

### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure Project Settings**
   ```json
   {
     "name": "soulara-frontend",
     "version": 2,
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "outputDirectory": ".next"
   }
   ```

3. **Environment Variables Setup**
   ```bash
   # Set production environment variables
   vercel env add NEXT_PUBLIC_API_URL production
   vercel env add NEXT_PUBLIC_SOCKET_URL production
   ```

### Custom Deployment Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Type checking..."
npm run type-check

# Run linting
echo "🧹 Linting code..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test

# Build application
echo "🏗️ Building application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
```

### Vercel Configuration

```json
{
  "version": 2,
  "name": "soulara-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_SOCKET_URL": "@socket-url"
  },
  "functions": {
    "app/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## 🔄 Alternative Platforms

### Netlify

```toml
# netlify.toml
[build]
  publish = ".next"
  command = "npm run build && npm run export"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### AWS Amplify

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.soulara.app
      - NEXT_PUBLIC_SOCKET_URL=wss://api.soulara.app
    restart: unless-stopped
    networks:
      - soulara-network

networks:
  soulara-network:
    driver: bridge
```

## ⚙️ CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test
        
      - name: Test build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_SOCKET_URL: ${{ secrets.NEXT_PUBLIC_SOCKET_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Quality Gates

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Code quality check
        run: |
          npm run lint
          npm run type-check
          npm run test:coverage
          
      - name: Security audit
        run: npm audit --audit-level moderate
        
      - name: Bundle size check
        run: npm run build-stats
        
      - name: Performance audit
        run: npm run lighthouse
```

## 🚄 Performance Optimization

### Build Optimization

```javascript
// next.config.ts - Production optimizations
const nextConfig = {
  // Compression
  compress: true,
  
  // Bundle analyzer
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    gzipSize: true,
  },
};
```

### Performance Monitoring

```typescript
// lib/performance.ts
export const reportWebVitals = (metric: any) => {
  // Log to analytics service
  if (process.env.NODE_ENV === 'production') {
    console.log(metric);
    
    // Send to analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    });
  }
};
```

```typescript
// pages/_app.tsx
import { reportWebVitals } from '@/lib/performance';

export { reportWebVitals };
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
```

### Analytics Integration

```typescript
// lib/analytics.ts
import { GoogleAnalytics } from '@next/third-parties/google';

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const Analytics = () => {
  return (
    <GoogleAnalytics 
      gaId={process.env.NEXT_PUBLIC_GA_ID!} 
    />
  );
};
```

### Health Checks

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  };
  
  res.status(200).json(healthCheck);
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

#### Environment Variables

```bash
# Check if environment variables are loaded
npm run build -- --debug

# Verify environment in browser console
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Debugging Deployment

```bash
# Local production build test
npm run build
npm start

# Vercel local testing
vercel dev

# Check deployment logs
vercel logs [deployment-url]
```

### Performance Issues

```bash
# Bundle analysis
npm run build-stats
npm run analyze

# Lighthouse audit
npm run lighthouse

# Check Core Web Vitals
npm run web-vitals
```

## 📈 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint checks passed
- [ ] Bundle size within limits
- [ ] Environment variables configured
- [ ] Security headers configured
- [ ] Performance optimizations applied

### Post-deployment

- [ ] Health check endpoint responding
- [ ] All pages loading correctly
- [ ] API integration working
- [ ] Authentication flow functional
- [ ] WebSocket connections stable
- [ ] Error tracking configured
- [ ] Analytics tracking working
- [ ] Performance metrics collected

### Rollback Plan

```bash
# Vercel rollback
vercel rollback [deployment-url]

# GitHub revert
git revert [commit-hash]
git push origin main
```

## 📞 Support

For deployment issues:

- **Documentation**: Check this guide and Next.js docs
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **GitHub Issues**: Report bugs in the repository
- **Team Chat**: Contact the development team

## 🔗 Useful Links

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Performance Best Practices](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Security Headers](https://nextjs.org/docs/advanced-features/security-headers)