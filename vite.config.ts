import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// import { createProxyMiddleware } from 'http-proxy-middleware'
// import { auth } from 'basic-auth'

// const authenticate = (req, res, next) => {
//   const credentials = auth(req)
//   const validUsername = 'NOC' // Replace with your desired username
//   const validPassword = 'haigfras' // Replace with your desired password

//   if (
//     !credentials ||
//     credentials.name !== validUsername ||
//     credentials.pass !== validPassword
//   ) {
//     res.statusCode = 401
//     res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
//     res.end('Access denied')
//   } else {
//     next()
//   }
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: true,
    strictPort: true,
    port: 8080,
    https: true,
  },
})

// export default defineConfig({
//   base: './',
//   server: {
//     proxy: {
//       '/data': {
//         target: 'https://example.com/foo',
//         changeOrigin: true,
//         configure: (proxy, options) => {
//           // proxy will be an instance of 'http-proxy'
//           const username = 'username';
//           const password = 'password';
//           options.auth = `${username}:${password}`;
//         },
//       }
//     },
//   },
// })
