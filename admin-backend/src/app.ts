import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
    process.env.MAIN_BACKEND_URL || "http://localhost:5000"
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'admin-backend',
    timestamp: new Date().toISOString() 
  });
});

// Admin API routes will be added here
app.get('/api/admin/stats', (req, res) => {
  res.json({ message: 'Admin stats endpoint' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Admin Backend Server running on port ${PORT}`);
});

export { app };