import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://client-lime-beta.vercel.app', 'http://localhost:5173']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'accept'],
  exposedHeaders: ['token'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

// Handle OPTIONS preflight requests
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Root route
app.get('/', (req, res) => res.json({ message: "Imagify API is running" }));

// Test route
app.get('/api/test', (req, res) => res.json({ message: "API endpoints are working" }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url} not found`);
  res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/user/login');
  console.log('- POST /api/user/register');
  console.log('- GET /api/user/credits');
});