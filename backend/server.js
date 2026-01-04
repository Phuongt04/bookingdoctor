import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose"; // Thêm import mongoose để kiểm tra connection
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Import các Router
import adminRouter from "./routes/adminRoute.js";
import chatRouter from "./routes/chatRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Kết nối database và cloud services
connectDB();
connectCloudinary();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Thêm dòng này

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://bookingdoctor-admin.vercel.app',
        'https://bookingdoctor-client.vercel.app',
        'https://bookingdoctor.vercel.app'
      ]
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Middleware xử lý timeout
app.use((req, res, next) => {
  // Set timeout 25s (Render timeout là 30s)
  req.setTimeout(25000, () => {
    if (!res.headersSent) {
      res.status(408).json({ 
        success: false, 
        message: 'Request timeout' 
      });
    }
  });
  
  // Set response timeout
  res.setTimeout(25000, () => {
    if (!res.headersSent) {
      res.status(504).json({ 
        success: false, 
        message: 'Gateway timeout' 
      });
    }
  });
  
  next();
});

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/", async (req, res) => {
  try {
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: "unknown",
        cloudinary: "unknown",
        backend: "running"
      }
    };
    
    // Kiểm tra MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.services.database = "connected";
      // Test query nhỏ
      const count = await mongoose.connection.db.admin().ping();
      healthCheck.services.database = count ? "healthy" : "warning";
    } else if (mongoose.connection.readyState === 2) {
      healthCheck.services.database = "connecting";
    } else {
      healthCheck.services.database = "disconnected";
    }
    
    // Kiểm tra Cloudinary
    healthCheck.services.cloudinary = process.env.CLOUDINARY_CLOUD_NAME 
      ? "configured" 
      : "not configured";
    
    // Trả về status code phù hợp
    if (healthCheck.services.database === "connected" || healthCheck.services.database === "healthy") {
      res.json(healthCheck);
    } else {
      res.status(503).json({
        ...healthCheck,
        status: "degraded",
        message: "Some services are not available"
      });
    }
    
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ 
      status: "unhealthy",
      error: "Health check failed",
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  
  // Nếu là lỗi từ multer (upload file)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum 5MB allowed.'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Xử lý shutdown graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Keep-alive ping để tránh Render sleep
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    console.log('Keep-alive ping:', new Date().toISOString());
  }, 600000); // 10 phút
}

export default app;