// Code này không dùng thư viện, mà gọi thẳng vào Google để kiểm tra Key
const API_KEY = "AIzaSyDbEqSUd8FYQe1tGhfCuuF3SyElFn9nXSY"; // Key của bạn
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkModels() {
  console.log("Dang hoi Google xem Key nay dung duoc model nao...");
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.log("❌ LỖI TO RỒI: ", data.error.message);
    } else {
      console.log("✅ THÀNH CÔNG! Các model bạn được dùng là:");
      // In ra danh sách các model
      data.models.forEach(m => console.log(" - " + m.name.replace("models/", "")));
    }
  } catch (error) {
    console.log("Lỗi kết nối:", error);
  }
}

checkModels();