import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    
    // Lấy URL Backend từ biến môi trường
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 1. Hàm lấy danh sách bác sĩ (Cập nhật dùng POST)
    const getAllDoctors = async () => {
        try {
            // 👇 QUAN TRỌNG: Backend đã sửa thành POST, nên ở đây cũng phải POST
            const { data } = await axios.post(
                backendUrl + '/api/admin/all-doctors', 
                {}, 
                { headers: { aToken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
                console.log("Admin Doctors:", data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 2. Hàm thay đổi trạng thái (Available)
    const changeAvailability = async (docId) => {
        try {
            // 👇 Backend route changeAvailability cũng cần gọi đúng (thường là POST/PUT)
            // Dựa vào code backend cũ: router.post('/change-availability', ...)
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { docId }, 
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Load lại danh sách để cập nhật giao diện
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl,
        doctors, getAllDoctors,
        changeAvailability
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;