import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Import các Router
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
// import chatRouter from "./routes/chatRoute.js"; // Tạm tắt nếu chưa có file này để tránh lỗi crash
// import userRouter from "./routes/userRoute.js"; // Tạm tắt nếu chưa có file này

// App config
const app = express();
const port = process.env.PORT || 4000;

// Kết nối database và cloud services
connectDB();
connectCloudinary();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cho phép TẤT CẢ các trang web đều vào được (Dùng để fix lỗi nhanh)
app.use(cors({ origin: true, credentials: true }));
// Middleware xử lý timeout cho Render (Tránh bị ngắt kết nối sớm)
app.use((req, res, next) => {
  req.setTimeout(25000, () => {
    if (!res.headersSent) {
      res.status(408).json({ success: false, message: 'Request timeout' });
    }
  });
  res.setTimeout(25000, () => {
    if (!res.headersSent) {
      res.status(504).json({ success: false, message: 'Gateway timeout' });
    }
  });
  next();
});

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
// app.use("/api/chat", chatRouter); // Mở comment khi đã có file route
// app.use("/api/user", userRouter); // Mở comment khi đã có file route

// Health Check Endpoint (Để kiểm tra server sống hay chết)
app.get("/", async (req, res) => {
  const healthCheck = {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: "disconnected"
  };

  if (mongoose.connection.readyState === 1) {
    healthCheck.database = "connected";
  } else if (mongoose.connection.readyState === 2) {
    healthCheck.database = "connecting";
  }

  res.json(healthCheck);
});

// Global Error Handler (Bắt lỗi toàn cục)
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File size too large (Max 5MB)' });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Khởi động Server
const server = app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Xử lý khi tắt server (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server.');
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

export default app;