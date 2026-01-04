import express from "express";
import {aminLogin, addDoctors } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import {authAdmin} from "../middleware/authAdmin.js";

const adminRouter = express.Router();
// Route to add a doctor
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctors);
adminRouter.post("/login", aminLogin);
adminRouter.post('/all-doctors', authAdmin, addDoctors) // Thêm dòng này
export default adminRouter;
