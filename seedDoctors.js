// Tạo file seedDoctors.js
import mongoose from 'mongoose';
import Doctor from './models/doctorModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await Doctor.deleteMany();
    
    const hashedPassword = await bcrypt.hash('doctor123', 10);
    
    const doctors = [
      {
        name: 'Dr. Nguyễn Văn A',
        email: 'doctor1@example.com',
        password: hashedPassword,
        specialization: 'Cardiology',
        experience: 10,
        fees: 500000,
        degree: 'MD, PhD',
        available: true,
        image: 'https://example.com/doctor1.jpg'
      },
      {
        name: 'Dr. Trần Thị B',
        email: 'doctor2@example.com',
        password: hashedPassword,
        specialization: 'Pediatrics',
        experience: 8,
        fees: 450000,
        degree: 'MD',
        available: true,
        image: 'https://example.com/doctor2.jpg'
      }
    ];
    
    await Doctor.insertMany(doctors);
    console.log('✅ Doctors seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors();