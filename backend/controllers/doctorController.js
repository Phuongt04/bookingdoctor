import doctorModel from "../models/doctorModel.js"
import mongoose from "mongoose";

const doctorList = async (req, res) => {
  try {
    console.log("=== DEBUG: doctorList called ===");
    
    // Kiểm tra kết nối database
    const dbState = mongoose.connection.readyState;
    console.log("MongoDB connection state:", dbState);
    console.log("0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting");
    
    if (dbState !== 1) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database not connected',
        connectionState: dbState 
      });
    }
    
    // Thử lấy tất cả collections để debug
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Kiểm tra xem collection doctors có tồn tại không
    const hasDoctorsCollection = collections.some(c => c.name === 'doctors');
    console.log("Has doctors collection:", hasDoctorsCollection);
    
    if (!hasDoctorsCollection) {
      return res.json({ 
        success: true, 
        doctors: [],
        message: 'Doctors collection does not exist yet' 
      });
    }
    
    // Lấy danh sách bác sĩ
    console.log("Fetching doctors...");
    const doctors = await doctorModel.find({}).select(['-password','-email']);
    
    console.log(`Found ${doctors.length} doctors`);
    
    if (doctors.length === 0) {
      console.log("No doctors in database. Please add some doctors first.");
    }
    
    res.json({
      success: true,
      count: doctors.length,
      doctors: doctors,
      databaseInfo: {
        connected: true,
        collectionExists: hasDoctorsCollection,
        totalDoctors: doctors.length
      }
    });
    
  } catch (error) {
    console.error("Error in doctorList:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching doctors',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

const changeAvailability = async (req, res) => {
  try {
    const {docId} = req.body;
    
    if (!docId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Doctor ID is required' 
      });
    }
    
    const docData = await doctorModel.findById(docId);
    
    if (!docData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }
    
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
    
    res.json({ 
      success: true, 
      message: 'Availability Changed',
      newStatus: !docData.available 
    });
    
  } catch (error) {
    console.log("Error in changeAvailability:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export { changeAvailability, doctorList };