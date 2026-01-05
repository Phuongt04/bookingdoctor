import { GoogleGenerativeAI } from "@google/generative-ai";

const chatBot = async (req, res) => {
    try {
        // 1. Nhận dữ liệu linh hoạt hơn (chấp nhận cả prompt, message, question)
        const { prompt, message, question } = req.body;
        const userQuestion = prompt || message || question;

        // Kiểm tra xem có câu hỏi không
        if (!userQuestion) {
            console.log("❌ Lỗi: Không nhận được câu hỏi từ Frontend", req.body);
            return res.json({ 
                success: false, 
                message: "Bạn chưa nhập câu hỏi! (Server không nhận được dữ liệu)" 
            });
        }

        // 2. Khởi tạo Gemini với API Key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 3. Chọn model chuẩn (Sửa gemini-2.5 thành gemini-1.5-flash hoặc gemini-pro)
        // gemini-1.5-flash: Nhanh, phản hồi tốc độ cao cho chat
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 4. Gửi câu hỏi và chờ phản hồi
        const result = await model.generateContent(userQuestion);
        const response = await result.response;
        const text = response.text();

        // 5. Trả kết quả về cho Frontend
        res.json({ 
            success: true, 
            message: text 
        });

    } catch (error) {
        console.error("❌ Gemini Error:", error);
        res.json({ 
            success: false, 
            message: "Bot đang bận hoặc lỗi kết nối. Vui lòng thử lại sau!" 
        });
    }
}

export { chatBot };