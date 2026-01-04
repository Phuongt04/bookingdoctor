import { GoogleGenerativeAI } from "@google/generative-ai";

const chatBot = async (req, res) => {
    try {
        const { prompt } = req.body;

        // Kiểm tra xem user có gửi câu hỏi không
        if (!prompt) {
            return res.json({ success: false, message: "Bạn chưa nhập câu hỏi!" });
        }

        // 1. Khởi tạo Gemini với API Key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 2. Chọn model (gemini-pro là model xử lý văn bản tốt nhất hiện tại)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. Gửi câu hỏi và chờ phản hồi
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. Trả kết quả về cho Frontend
        res.json({ 
            success: true, 
            message: text 
        });

    } catch (error) {
        console.log("Gemini Error:", error);
        res.json({ 
            success: false, 
            message: "Bot đang bận hoặc lỗi kết nối. Vui lòng thử lại sau!" 
        });
    }
}

export { chatBot };