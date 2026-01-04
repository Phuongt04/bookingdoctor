import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js"; // Lưu ý: Kiểm tra tên file là mongobd.js hay mongodb.js nhé
import connectCloudinary from "./config/cloudinary.js";

// Import các Router
import adminRouter from "./routes/adminRoute.js";
import chatRouter from "./routes/chatRoute.js";
import doctorRouter from "./routes/doctorRoute.js"; // ✅ THÊM DÒNG NÀY (Để lấy list bác sĩ)
import userRouter from "./routes/userRoute.js";     // ✅ THÊM DÒNG NÀY (Để khách đặt lịch)

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// MIDDLEWARES
app.use(express.json());
app.use(cors()); // Cho phép Frontend gọi API

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);
app.use("/api/doctor", doctorRouter); // ✅ QUAN TRỌNG: Đường dẫn hiển thị danh sách bác sĩ
app.use("/api/user", userRouter);     // ✅ QUAN TRỌNG: Đường dẫn cho người dùng

app.get("/", (req, res) => {
  res.send("API WORKING FINE 🙂");
});

app.listen(port, () => console.log("server started", port));
 