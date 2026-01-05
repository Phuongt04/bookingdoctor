import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tôi có thể giúp gì cho bạn về việc đặt lịch khám?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Hiện câu hỏi của người dùng ngay lập tức
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Gọi API xuống Backend (Backend sẽ gọi Gemini)
      // Lưu ý: Kiểm tra lại port 4000 xem có khớp với backend của bạn không
      // const { data } = await axios.post('https://booking-backend-7f3v.onrender.com', { question: input }); <-- SAI
      const { data } = await axios.post('https://booking-backend-7f3v.onrender.com/api/chat', { question: input });

      // 3. Hiện câu trả lời của AI
      const botMessage = { text: data.message, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Lỗi kết nối!", sender: "bot" }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Nút bật tắt chat */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        💬 Chat
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary text-white p-3 font-bold">Trợ lý ảo AI</div>
          
          <div className="h-64 overflow-y-auto p-3 bg-gray-50 flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 italic">AI đang soạn tin...</div>}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Bạn cần giúp gì?"
              className="flex-1 border rounded px-2 py-1 text-sm outline-none"
            />
            <button onClick={sendMessage} className="bg-primary text-white px-3 py-1 rounded text-sm">Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;