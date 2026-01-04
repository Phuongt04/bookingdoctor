import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Kiểm tra xem MONGODB_URI có tồn tại không
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://bookingdoctor:phuong104@cluster0.gwc1dbf.mongodb.net/?appName=Cluster0'));

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 giây timeout
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Test connection
    await conn.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Hiển thị lỗi chi tiết hơn
    if (error.name === 'MongoServerError') {
      console.error('MongoServerError code:', error.code);
      console.error('MongoServerError message:', error.message);
    } else if (error.name === 'MongooseError') {
      console.error('MongooseError:', error.message);
    }
    
    // Không thoát chương trình trong production
    // Chỉ log lỗi và tiếp tục retry
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

export default connectDB;