// Simple development proxy server to handle CORS
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Proxy all /api requests to the target server
app.use('/api', createProxyMiddleware({
  target: 'https://1105460.wsol.vertafore.com/iisapp',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Proxying:', req.method, req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('✅ Response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.log('❌ Error:', err.message);
  }
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Development proxy server running on http://localhost:${PORT}`);
  console.log('Update your .env to: VITE_IMAGERIGHT_API_URL=http://localhost:3001/api');
});

