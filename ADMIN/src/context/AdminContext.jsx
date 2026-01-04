import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Admincontext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]); // Thêm state doctors
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Thêm hàm lấy danh sách
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Thêm hàm đổi trạng thái (nếu cần cho DoctorList)
  const changeAvailability = async (docId) => {
    try {
        const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
        if (data.success) {
            toast.success(data.message)
            getAllDoctors()
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const value = {
    aToken, setAToken,
    backendUrl,
    doctors, getAllDoctors, changeAvailability // Nhớ export ra
  };

  return (
    <Admincontext.Provider value={value}>
      {props.children}
    </Admincontext.Provider>
  );
};
export default AdminContextProvider;