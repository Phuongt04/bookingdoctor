import express from "express";
import { addDoctors, adminLogin, allDoctors } from "../controllers/adminController.js";
import { authAdmin } from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
import { changeAvailability } from '../controllers/doctorController.js';
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctors);
adminRouter.post("/login", adminLogin);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
// 👇 THÊM DÒNG NÀY (Để Admin hiện danh sách):
adminRouter.post("/all-doctors", authAdmin, allDoctors);

export default adminRouter;