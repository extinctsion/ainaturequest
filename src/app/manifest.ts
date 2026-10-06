import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Nature Quest - Outdoor Adventure PWA',
    short_name: 'NatureQuest',
    description: 'AI-powered outdoor adventure game that gets you outside and off your screen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e1f14',
    theme_color: '#142e1d',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}
