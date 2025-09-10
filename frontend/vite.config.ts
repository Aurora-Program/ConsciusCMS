import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Intentionally leaving frontend base default. CMS app uses base '/admin/'.
  server: {
    port: 5174,
    open: true,
  },
})
