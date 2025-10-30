// Environment configuration helper
export const env = {
  // Site configuration
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "CodeCloudWorld Learning Platform",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
  SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Interactive learning platform for programming courses and tutorials",
  
  // PWA configuration
  PWA_NAME: process.env.NEXT_PUBLIC_PWA_NAME || "CCW Learn",
  PWA_SHORT_NAME: process.env.NEXT_PUBLIC_PWA_SHORT_NAME || "CCW Learn",
  PWA_THEME_COLOR: process.env.NEXT_PUBLIC_PWA_THEME_COLOR || "#3b82f6",
  PWA_BACKGROUND_COLOR: process.env.NEXT_PUBLIC_PWA_BACKGROUND_COLOR || "#ffffff",
  
  // Analytics
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  GTAG_ID: process.env.NEXT_PUBLIC_GTAG_ID,
  
  // Error tracking
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Content configuration
  CONTENT_CACHE_TTL: parseInt(process.env.CONTENT_CACHE_TTL) || 300,
  REVALIDATE_TIME: parseInt(process.env.REVALIDATE_TIME) || 300,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};

// Validation helper
export function validateEnv() {
  const required = [];
  
  if (env.IS_PRODUCTION) {
    if (!env.SITE_URL || env.SITE_URL.includes('localhost')) {
      required.push('NEXT_PUBLIC_SITE_URL');
    }
  }
  
  if (required.length > 0) {
    throw new Error(`Missing required environment variables: ${required.join(', ')}`);
  }
}

// SEO helper
export function getSEOConfig(page = {}) {
  return {
    title: page.title ? `${page.title} | ${env.SITE_NAME}` : env.SITE_NAME,
    description: page.description || env.SITE_DESCRIPTION,
    url: `${env.SITE_URL}${page.path || ''}`,
    image: page.image || `${env.SITE_URL}/icons/icon-512x512.svg`,
    siteName: env.SITE_NAME,
  };
}
