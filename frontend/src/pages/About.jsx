import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="text-center text-3xl md:text-4xl font-bold pt-10 text-blue-700 tracking-wide relative inline-block w-full">
        <span className="after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-400 after:mx-auto after:mt-2">ABOUT <span className="text-purple-700">US</span></span>
      </div>
      <div className="my-12 flex flex-col md:flex-row gap-12 items-center justify-center px-4 md:px-0">
        <img
          src={assets.about_image}
          alt="About Prescripto"
          className="w-full md:max-w-[360px] rounded-3xl shadow-xl border-4 border-white"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-gray-700 bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100">
          <p className="text-lg font-medium text-gray-800">
            Chào mừng bạn đến với <span className="text-blue-600 font-bold">Prescripto</span>, đối tác đáng tin cậy của bạn trong việc quản lý nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả. Tại Prescripto, chúng tôi hiểu rõ những thách thức mà cá nhân phải đối mặt khi lên lịch khám bác sĩ và quản lý hồ sơ sức khỏe của họ.
          </p>
          <p>
            Sứ mệnh của chúng tôi là đơn giản hóa quá trình này thông qua nền tảng trực tuyến thân thiện với người dùng, cho phép bạn dễ dàng đặt lịch hẹn với các chuyên gia y tế hàng đầu, truy cập hồ sơ sức khỏe cá nhân và nhận nhắc nhở quan trọng về các cuộc hẹn sắp tới. Với Prescripto, bạn có thể tập trung vào việc chăm sóc sức khỏe của mình trong khi chúng tôi lo liệu phần còn lại.
          </p>
          <div>
            <b className="text-xl text-purple-700 block mb-2">Tầm nhìn của chúng tôi</b>
            <p>
              Tầm nhìn của chúng tôi tại <span className="text-blue-600 font-semibold">Prescripto</span> là tạo ra một trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi hướng đến việc tạo cầu nối giữa bệnh nhân và các nhà cung cấp dịch vụ chăm sóc sức khỏe, giúp bạn dễ dàng tiếp cận dịch vụ chăm sóc sức khỏe mà bạn cần, khi bạn cần nó.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
