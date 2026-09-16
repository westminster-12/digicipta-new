import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // Peringatkan jika chunk > 500 KB
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: react core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Vendor: react-router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Supabase client — dimuat di banyak halaman, pisahkan
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // TipTap editor — sangat berat, hanya untuk halaman admin
          if (id.includes('node_modules/@tiptap') || id.includes('node_modules/lowlight')) {
            return 'vendor-tiptap';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
          // Admin pages chunk terpisah
          if (id.includes('/pages/admin/') || id.includes('/components/admin/')) {
            return 'admin';
          }
        },
      },
    },
  },
})
