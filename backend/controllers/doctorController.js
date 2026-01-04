import doctorModel from "../models/doctorModel.js";
import mongoose from "mongoose";

const doctorList = async (req, res) => {
  try {
    console.log("=== DEBUG DOCTOR LIST ===");
    
    // 1. Kiểm tra kết nối database
    const connectionState = mongoose.connection.readyState;
    console.log("MongoDB Connection State:", connectionState);
    
    if (connectionState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
        state: connectionState
      });
    }
    
    // 2. Kiểm tra collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in database:", collections.map(c => c.name));
    
    // 3. Kiểm tra model
    console.log("Model name:", doctorModel.modelName);
    console.log("Collection name:", doctorModel.collection.name);
    
    // 4. Đếm số documents trong collection
    const count = await doctorModel.countDocuments();
    console.log("Total doctors in database:", count);
    
    // 5. Lấy danh sách bác sĩ
    if (count === 0) {
      return res.json({
        success: true,
        message: "No doctors found in database. Please add doctors first.",
        doctors: [],
        count: 0
      });
    }
    
    const doctors = await doctorModel.find({})
      .select(['-password', '-email', '-__v'])
      .sort({ createdAt: -1 });
    
    console.log("Successfully fetched", doctors.length, "doctors");
    
    res.json({
      success: true,
      count: doctors.length,
      doctors: doctors
    });
    
  } catch (error) {
    console.error("❌ ERROR in doctorList:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message
    });
  }
}

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    
    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required"
      });
    }
    
    const doctor = await doctorModel.findById(docId);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    // Đổi trạng thái available
    doctor.available = !doctor.available;
    await doctor.save();
    
    res.json({
      success: true,
      message: "Availability changed successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        available: doctor.available
      }
    });
    
  } catch (error) {
    console.error("Error in changeAvailability:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export { changeAvailability, doctorList };