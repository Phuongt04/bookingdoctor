import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Dùng để thông báo lỗi nếu có

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  
  // 👉 1. Khai báo đường dẫn Backend
  // Nếu có biến môi trường thì dùng, không thì dùng localhost
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://booking-backend-7f3v.onrender.com";
  
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);

  // 👉 2. Hàm gọi danh sách bác sĩ từ Server
  const getDoctorsData = async () => {
    try {
      // Gọi API lấy danh sách bác sĩ
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // 👉 3. Tự động gọi hàm trên khi web vừa load
  useEffect(() => {
    getDoctorsData();
  }, []);

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl // Xuất biến này ra để các trang khác (như Chatbot) dùng ké
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;