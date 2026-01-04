import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// Lấy danh sách tất cả bác sĩ
const doctorList = async (req, res) => {
  try {
    console.log("Fetching doctors list...");
    
    // Tìm tất cả bác sĩ, ẩn password và email
    const doctors = await doctorModel.find({})
      .select(['-password', '-email', '-createdAt', '-updatedAt'])
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
      
    console.log(`Found ${doctors.length} doctors`);
    
    res.status(200).json({ 
      success: true, 
      count: doctors.length,
      data: doctors 
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching doctors',
      error: error.message 
    });
  }
};

// Lấy chi tiết bác sĩ theo ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await doctorModel.findById(id)
      .select(['-password', '-email']);
      
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: doctor 
    });
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Thêm bác sĩ mới
const createDoctor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      specialization, 
      experience, 
      fees, 
      degree,
      available 
    } = req.body;

    // Kiểm tra required fields
    if (!name || !email || !password || !specialization || !fees) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Doctor with this email already exists' 
      });
    }

    // Upload ảnh lên Cloudinary nếu có
    let imageUrl = '';
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bookingdoctor/doctors',
          transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ 
          success: false, 
          message: 'Error uploading image' 
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo bác sĩ mới
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      specialization,
      experience: experience || 0,
      fees,
      degree: degree || '',
      available: available || true,
      image: imageUrl
    });

    await newDoctor.save();

    // Ẩn password khi trả về
    newDoctor.password = undefined;

    res.status(201).json({ 
      success: true, 
      message: 'Doctor created successfully',
      data: newDoctor 
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating doctor',
      error: error.message 
    });
  }
};

// Cập nhật bác sĩ
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Nếu có password mới, hash nó
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Upload ảnh mới nếu có
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bookingdoctor/doctors'
        });
        updateData.image = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select(['-password', '-email']);

    if (!updatedDoctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Doctor updated successfully',
      data: updatedDoctor 
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating doctor',
      error: error.message 
    });
  }
};

// Xóa bác sĩ
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await doctorModel.findByIdAndDelete(id);
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Doctor deleted successfully' 
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting doctor',
      error: error.message 
    });
  }
};

// Thay đổi trạng thái available
const changeAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await doctorModel.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.status(200).json({ 
      success: true, 
      message: 'Availability changed',
      available: doctor.available 
    });
  } catch (error) {
    console.error("Error changing availability:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error changing availability',
      error: error.message 
    });
  }
};

export { 
  doctorList, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor, 
  changeAvailability 
};