import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongobd.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import chatRouter from "./routes/chatRoute.js"; // 👈 QUAN TRỌNG 1: Import file route chat

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter); // 👈 QUAN TRỌNG 2: Đăng ký đường dẫn chat

app.get("/", (req, res) => {
  res.send("API WORKING FINE 🙂");
});

app.listen(port, () => console.log("server started", port));