import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      exclude: ['src/main.jsx', 'src/App.jsx'],
      all: true,
      include: ['src/**/*.js', 'src/**/*.jsx']
    }
  }
})
