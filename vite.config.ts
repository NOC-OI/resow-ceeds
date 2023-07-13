import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // plugins: [react(), mkcert(), EnvironmentPlugin('all')],
    plugins: [react(), EnvironmentPlugin('all')],
    server: {
      host: true,
      // https: true,
      strictPort: true,
      port: 8080,
    },
    define: {
      'process.env.YOUR_STRING_VARIABLE': JSON.stringify(
        env.YOUR_STRING_VARIABLE,
      ),
      'process.env.APP_USE_AVT': env.APP_USE_AVT,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
        },
      },
    },
  }
})
