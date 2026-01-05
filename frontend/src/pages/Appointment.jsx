import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const navigate = useNavigate()

    // 1. Hàm lấy thông tin chi tiết bác sĩ
    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    // 2. Hàm tạo các slot giờ (Logic tính toán ngày giờ)
    const getAvailableSlots = async () => {
        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                
                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()
                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                // Kiểm tra xem giờ này đã bị đặt chưa (Dựa vào dữ liệu từ Backend)
                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    // 3. Hàm Đặt lịch (GỌI API XUỐNG BACKEND)
    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Vui lòng đăng nhập để đặt lịch!')
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0].datetime
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            const slotDate = day + "_" + month + "_" + year

            // Gọi API: POST /api/user/book-appointment
            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment', 
                { docId, slotDate, slotTime }, 
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData() // Load lại data để cập nhật slot đã mất
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])

    return docInfo && (
        <div>
            {/* ... Phần giao diện hiển thị thông tin bác sĩ (Giữ nguyên) ... */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
                </div>
            </div>

            {/* ... Phần chọn giờ (Booking slots) ... */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                            <p>{item[0] && ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item[0].datetime.getDay()]}</p>
                        </div>
                    ))}
                </div>
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                {/* NÚT ĐẶT LỊCH: Gọi hàm bookAppointment */}
                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
            </div>

            {/* Danh sách bác sĩ liên quan */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    )
}

export default Appointment