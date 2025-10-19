import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { validateEnv } from './utils/envValidator';

// Load environment variables first
dotenv.config();

// Validate environment variables before starting the server
try {
  validateEnv();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - must come before helmet
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_BACKEND_URL || "http://localhost:5001"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

// Helmet configuration - configured to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'main-backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Main Backend Server running on port ${PORT}`);
});

export { app, io };