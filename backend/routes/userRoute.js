import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js'; 
import upload from '../middleware/multer.js';

const userRouter = express.Router();

// Đăng ký & Đăng nhập
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Thông tin cá nhân & Đặt lịch (Yêu cầu đăng nhập)
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);

export default userRouter;