import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const TOKEN = process.env.VITE_TRIPADVISOR_TOKEN

const app = express();
const router = express.Router();


router.get('/hello', cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}), (req, res) => {
  res.send('Hello World');
});

app.use(router);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200, 
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// proxy middleware for the TripAdvisor API
app.use('/api', createProxyMiddleware({
  target: 'https://api.content.tripadvisor.com/api/v1',
  changeOrigin: true,
  logLevel: 'debug',
  // pathRewrite: {
  //   '^/api': '', 
  // },

  onProxyReq: (proxyReq, req, res) => {
    // authentication headers
    // proxyReq.setHeader('Referer', 'http://136.58.121.1:3000');
    // proxyReq.setHeader('Origin', 'http://136.58.121.1:3000');
    // proxyReq.setHeader('Authorization', `Bearer ${TOKEN}`);
    console.log('Proxy Request:', proxyReq.method, proxyReq.path);
    console.log('Request Headers:', proxyReq.getHeaders());
  },
  onProxyRes: (proxyRes, req, res) => {
    // add CORS headers to the response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    console.log('Proxy Response:', proxyRes.statusCode);
    console.log('Response Headers:', proxyRes.headers);
  },

}));

const PORT = 3000; 

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});