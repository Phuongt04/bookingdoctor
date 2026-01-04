import express from 'express';
import { 
  doctorList, 
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  changeAvailability 
} from '../controllers/doctorController.js';
import { authAdmin } from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// ✅ Public routes (không cần auth)
router.get('/', doctorList);                 // GET /api/doctor - Lấy tất cả bác sĩ
router.get('/:id', getDoctorById);           // GET /api/doctor/:id - Lấy chi tiết bác sĩ

// ✅ Protected admin routes (cần auth)
router.post('/', authAdmin, upload.single('image'), createDoctor);        // Thêm bác sĩ
router.put('/:id', authAdmin, upload.single('image'), updateDoctor);      // Cập nhật bác sĩ
router.delete('/:id', authAdmin, deleteDoctor);                           // Xóa bác sĩ
router.put('/availability/:id', authAdmin, changeAvailability);           // Thay đổi trạng thái

export default router;