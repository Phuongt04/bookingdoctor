import express from 'express';
import { doctorList } from '../controllers/doctorController.js';

const doctorRouter = express.Router();

// API lấy danh sách toàn bộ bác sĩ
doctorRouter.get('/list', doctorList);

export default doctorRouter;