import express from "express";
import { addDoctors, aminLogin } from "../controllers/adminController.js"; // Đảm bảo đúng tên hàm
import { authAdmin } from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js"; // <-- QUAN TRỌNG: Phải có dòng này

const adminRouter = express.Router();

adminRouter.post("/login", aminLogin);

// Dòng này BẮT BUỘC phải có 'upload.single("image")' thì mới gửi ảnh được
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctors);

export default adminRouter;