import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    // Khai báo các biến State
    const currencySymbol = '$' // Hoặc 'VNĐ' tùy bạn
    const backendUrl = import.meta.env.VITE_BACKEND_URL // Lấy link từ biến môi trường
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

    // 1. Hàm lấy danh sách bác sĩ từ Backend
    const getDoctorsData = async () => {
        try {
            // Gọi API: /api/doctor/list
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
                console.log("Đã lấy được danh sách bác sĩ:", data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // 2. Hàm lấy thông tin User (nếu đã đăng nhập)
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Chạy hàm lấy bác sĩ ngay khi web vừa tải
    useEffect(() => {
        getDoctorsData()
    }, [])

    // Chạy hàm lấy profile khi token thay đổi (đăng nhập/đăng xuất)
    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    // Đóng gói các biến để truyền đi khắp nơi trong App
    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;