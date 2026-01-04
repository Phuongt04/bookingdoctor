import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;
    // Dán trực tiếp cái mã AIza... của bạn vào trong ngoặc kép
    const genAI = new GoogleGenerativeAI("AIzaSyDbEqSUd8FYQe1tGhfCuuF3SyElFn9nXSY");
    // Thêm đuôi -001 vào
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prompt Engineering: Dạy cho AI biết nó là ai
    const prompt = `Bạn là trợ lý ảo của trang web đặt lịch khám bệnh DoctorBooking. 
    Hãy trả lời ngắn gọn, thân thiện và hữu ích cho câu hỏi sau của khách hàng: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, message: text });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "AI đang bận, vui lòng thử lại sau!" });
  }
};