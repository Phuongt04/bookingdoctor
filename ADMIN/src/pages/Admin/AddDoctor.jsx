import React, { useContext, useState } from "react";
import { assets } from "../../assets.js";
// SỬA 1: Import đúng tên AdminContext (Chữ C hoa)
import { AdminContext } from "../../context/AdminContext"; 
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Please upload a doctor image");
      }
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("education", education);
      formData.append("about", about);
      formData.append(
        "address", // Lưu ý: Backend thường nhận field 'address', kiểm tra lại backend của bạn nếu nó cần 'address1' hay 'address'
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // SỬA 2: Thêm dấu "/" trước api và xử lý kết quả
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor", 
        formData,
        {
          headers: { aToken },
        }
      );

      // SỬA 3: Kiểm tra success và reset form
      if (data.success) {
        toast.success(data.message);
        // Reset form
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
        toast.error(error.message);
        console.log(error);
    }
  };

  return (
    <form className="m-5 w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border border-gray-100 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        
        {/* Phần upload ảnh */}
        <div className="flex items-center gap-4 mb-8 text-xl font-semibold text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer h-16 object-cover" // Thêm object-cover để ảnh tròn đẹp
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Cột trái */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex-col gap-1">
              <p>Doctor name</p>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="border border-gray-300 rounded-md p-2 w-full" required />
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Doctor email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="border border-gray-300 rounded-md p-2 w-full" required />
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Doctor password</p>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-gray-300 rounded-md p-2 w-full" required />
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Experience</p>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="7 Year">7 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10 Years</option>
              </select>
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Fees</p>
              <input value={fees} onChange={(e) => setFees(e.target.value)} type="number" placeholder="Fees" className="border border-gray-300 rounded-md p-2 w-full" required />
            </div>
          </div>

          {/* Cột phải */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex-col gap-1">
              <p>Specialization</p>
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Education</p>
              <input value={education} onChange={(e) => setEducation(e.target.value)} type="text" placeholder="Education" className="border border-gray-300 rounded-md p-2 w-full" required />
            </div>
            <div className="flex-1 flex-col gap-1">
              <p>Address</p>
              <input value={address1} onChange={(e) => setAddress1(e.target.value)} type="text" placeholder="Address 1" className="border border-gray-300 rounded-md p-2 w-full" required />
              <input value={address2} onChange={(e) => setAddress2(e.target.value)} type="text" placeholder="Address 2" className="mt-2 border border-gray-300 rounded-md p-2 w-full" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex-col gap-1">
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Write about doctor" rows={5} className="border border-gray-300 rounded-md px-4 pt-2 w-full" required />
        </div>
        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full hover:bg-indigo-700 transition-colors">Add doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;