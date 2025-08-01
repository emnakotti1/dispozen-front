import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Helper pour créer facilement des proxies
const createProxy = (paths: string[], target = 'http://localhost:3000') => {
  const proxy: Record<string, any> = {}

  paths.forEach(path => {
    proxy[path] = {
      target,
      changeOrigin: true,
      secure: false,
    }
  })

  return proxy
}

const backendPaths = ['/api', '/auth', '/users']

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: createProxy(backendPaths),
  },
})
