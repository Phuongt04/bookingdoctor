import { GoogleGenerativeAI } from "@google/generative-ai";

// Key mới của bạn (lấy từ ảnh bạn gửi)
const API_KEY = "AIzaSyD4sYUfLmlrWZBvodVCUdegKasWsRK1FeE"; 

const genAI = new GoogleGenerativeAI(API_KEY);

async function runTest() {
  console.log("--- Đang thử kết nối Google ---");
  
  // Thử model 1: gemini-1.5-flash (Mới nhất)
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Chào bạn");
    console.log("✅ Model 1.5-flash: CHẠY NGON!");
    console.log("Trả lời:", result.response.text());
    return; // Chạy được thì dừng luôn
  } catch (error) {
    console.log("❌ Model 1.5-flash lỗi:", error.message);
  }

  // Thử model 2: gemini-pro (Cũ hơn nhưng ổn định)
  try {
    console.log("--- Đang thử model cũ hơn ---");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Chào bạn");
    console.log("✅ Model gemini-pro: CHẠY NGON!");
    console.log("Trả lời:", result.response.text());
  } catch (error) {
    console.log("❌ Model gemini-pro lỗi:", error.message);
  }
}

runTest();