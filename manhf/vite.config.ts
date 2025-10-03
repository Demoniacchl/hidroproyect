import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'fredric-waxiest-terminatively.ngrok-free.dev',
      'localhost'
    ]
  },
  plugins: [react()],
})
