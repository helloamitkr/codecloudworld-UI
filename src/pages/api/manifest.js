export default function handler(req, res) {
  const manifest = {
    name: process.env.NEXT_PUBLIC_PWA_NAME || "CodeCloudWorld Learning Platform",
    short_name: process.env.NEXT_PUBLIC_PWA_SHORT_NAME || "CCW Learn",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Interactive learning platform for programming courses and tutorials",
    start_url: "/",
    display: "standalone",
    background_color: process.env.NEXT_PUBLIC_PWA_BACKGROUND_COLOR || "#ffffff",
    theme_color: process.env.NEXT_PUBLIC_PWA_THEME_COLOR || "#3b82f6",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-72x72.svg",
        sizes: "72x72",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-96x96.svg",
        sizes: "96x96",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-128x128.svg",
        sizes: "128x128",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-144x144.svg",
        sizes: "144x144",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-152x152.svg",
        sizes: "152x152",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable any"
      }
    ],
    shortcuts: [
      {
        name: "Courses",
        short_name: "Courses",
        description: "Browse available courses",
        url: "/courses",
        icons: [
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192"
          }
        ]
      },
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read latest blog posts",
        url: "/blog",
        icons: [
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192"
          }
        ]
      },
      {
        name: "Admin",
        short_name: "Admin",
        description: "Content management",
        url: "/admin",
        icons: [
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192"
          }
        ]
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.status(200).json(manifest);
}
