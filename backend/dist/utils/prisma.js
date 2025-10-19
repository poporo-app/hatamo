"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Singleton Prisma Client instance
let prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new client_1.PrismaClient();
}
else {
    // In development, use a global variable to prevent multiple instances
    // during hot reloading
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    prisma = global.prisma;
}
exports.default = prisma;
