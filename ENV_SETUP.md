# Environment Variables Setup

This project uses environment variables for configuration. Follow these steps to set up your environment.

## 📁 Environment Files

- `.env.local` - Development environment (git-ignored)
- `.env.production` - Production environment (git-ignored)
- `.env.example` - Example template (committed to git)
- `.env.production.example` - Production template (committed to git)

## 🚀 Quick Setup

### Development Setup
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### Production Setup
```bash
# Copy the production example
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

## 🔧 Required Variables

### Development
```env
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"
```

### Production
```env
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"  # REQUIRED
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"
ADMIN_USERNAME="admin"                          # REQUIRED
ADMIN_PASSWORD="secure-password"                # REQUIRED
```

## 📊 Optional Variables

### Analytics
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTAG_ID="GT-XXXXXXXXX"
```

### Error Tracking
```env
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

### AWS Deployment
```env
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
AWS_CLOUDFRONT_DISTRIBUTION_ID="EXXXXXXXXXX"
AWS_ACCESS_KEY_ID="AKIAXXXXXXXXXX"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

## 🎨 PWA Customization

```env
NEXT_PUBLIC_PWA_NAME="Your App Name"
NEXT_PUBLIC_PWA_SHORT_NAME="App"
NEXT_PUBLIC_PWA_THEME_COLOR="#3b82f6"
NEXT_PUBLIC_PWA_BACKGROUND_COLOR="#ffffff"
```

## 🔒 Security Notes

1. **Never commit** `.env.local` or `.env.production` files
2. **Always use** strong passwords for admin access
3. **Rotate secrets** regularly in production
4. **Use different** values for development and production

## 🛠️ Usage in Code

```javascript
// Using environment variables
import { env } from '../lib/env';

console.log(env.SITE_NAME);
console.log(env.IS_PRODUCTION);

// SEO configuration
import { getSEOConfig } from '../lib/env';

const seo = getSEOConfig({
  title: 'Page Title',
  description: 'Page description',
  path: '/page-path'
});
```

## 🚀 Deployment

### Vercel
```bash
# Set environment variables in Vercel dashboard
# or use Vercel CLI
vercel env add NEXT_PUBLIC_SITE_URL production
```

### AWS S3 + CloudFront
```bash
# Set environment variables in your CI/CD pipeline
# or use AWS Parameter Store
aws ssm put-parameter --name "/app/NEXT_PUBLIC_SITE_URL" --value "https://yourdomain.com"
```

### Docker
```dockerfile
# In your Dockerfile
ENV NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## ✅ Validation

The app will validate required environment variables on startup. If any required variables are missing in production, the app will throw an error.

```javascript
// Automatic validation
import { validateEnv } from '../lib/env';
validateEnv(); // Throws error if required vars missing
```
