import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Build CMS interface to be served under /admin/ path behind CloudFront
// This ensures generated asset URLs are /admin/assets/... (not from site root)
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
