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
    ? ['https://imagify-client.vercel.app', 'http://localhost:5173']
    : 'http://localhost:5173',
  credentials: true
}))

// Connect to MongoDB
connectDB();

// Routes
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.get('/', (req, res) => res.json({ message: "Imagify API is running" }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));