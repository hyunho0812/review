import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '맛동네 · 식당 리뷰',
        short_name: '맛동네',
        description: '서울 지도에서 식당을 찾아 별점과 리뷰를 남기는 앱',
        lang: 'ko',
        start_url: '/',
        display: 'standalone',
        background_color: '#f2f4f2',
        theme_color: '#d9722b',
        icons: [
          { src: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
    }),
  ],
})
