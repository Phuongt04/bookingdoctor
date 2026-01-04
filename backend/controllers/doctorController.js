import validator from "validator";
import bcrypt from "bcrypt"; // Sửa tên biến cho chuẩn
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import fs from "fs"; // Import fs để xóa file tạm sau khi upload

// API thêm bác sĩ
const addDoctors = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
      slots_booked,
    } = req.body;

    const imageFile = req.file;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    if (!name || !email || !password || !speciality || !degree || !experience || !fees || !address) {
      // Xóa file ảnh đã upload tạm nếu thiếu dữ liệu khác
      if(imageFile) fs.unlinkSync(imageFile.path); 
      return res.status(400).json({ success: false, message: "Missing required data" });
    }

    // 2. Validate Email & Password
    if (!validator.isEmail(email)) {
      if(imageFile) fs.unlinkSync(imageFile.path);
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 6) {
      if(imageFile) fs.unlinkSync(imageFile.path);
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Upload ảnh lên Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    
    // Validate upload ảnh
    if(!imageUpload || !imageUpload.secure_url) {
        return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    const imageUrl = imageUpload.secure_url;

    // 5. Lưu vào Database
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available, // Lưu ý: req.body gửi lên thường là string, có thể cần convert sang boolean nếu model yêu cầu
      fees,
      address: JSON.parse(address), // address gửi dạng string JSON
      date: Date.now(),
      slots_booked,
      image: imageUrl,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // 6. Xóa file tạm trên server sau khi đã upload lên Cloudinary thành công
    fs.unlinkSync(imageFile.path);

    res.json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });

  } catch (error) {
    // Xóa file ảnh nếu có lỗi xảy ra trong quá trình xử lý
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    console.error("Error adding doctor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Kiểm tra thông tin Admin cứng trong file .env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // SỬA LỖI BẢO MẬT: Payload nên là object, không nối chuỗi password vào
      const token = jwt.sign(
        { email: email, role: 'admin' }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Nên set thời gian hết hạn cho token
      );

      res.json({
        success: true,
        message: "Admin login successful",
        token: token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { adminLogin, addDoctors };