import express from 'express';
import {  
  doctorList,
  changeAvailability 
} from '../controllers/doctorController.js';
import { authAdmin } from '../middleware/authAdmin.js';

const doctorRouter = express.Router();

// 1. Lấy danh sách bác sĩ
// Dùng đường dẫn /list cho rõ ràng (API sẽ là: GET /api/doctor/list)
doctorRouter.get('/list', doctorList);                 

// 2. Thay đổi trạng thái bác sĩ (Cần quyền Admin)
// API sẽ là: POST /api/doctor/change-availability
// (Lưu ý: Controller của bạn đang nhận `docId` từ body, nên dùng POST sẽ hợp lý hơn PUT :id)
doctorRouter.post('/change-availability', authAdmin, changeAvailability);           

export default doctorRouter;