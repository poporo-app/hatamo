"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        process.env.ADMIN_BACKEND_URL || "http://localhost:5001"
    ],
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'main-backend',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
// Error handling middleware (must be last)
app.use(errorHandler_middleware_1.errorHandler);
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
