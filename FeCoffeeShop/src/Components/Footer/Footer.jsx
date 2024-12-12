import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";
import FooterBg from "@/assets/website/coffee-footer.jpg";

const FooterLinks = [
  {
    title: "Trang chủ",
    link: "/",
  },
  {
    title: "Sản phẩm",
    link: "/#ProductShow",
  },
  {
    title: "Liên hệ",
    link: "/#footer",
  },
];

const bgImage = {
  backgroundImage: `url(${FooterBg})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  minHeight: "400px",
  width: "100%",
};

const Footer = () => {
  return (
    <>
      <span id="footer"></span>
      <div style={bgImage} className="text-white">
        <div className="bg-black/40 min-h-[400px]">
          <div className="container grid md:grid-cols-3 pb-20 pt-5">
            {/* Company details*/}
            <div className="py-8 px-4">
              <a
                href="#"
                className="font-semibold tracking-widest text-2xl sm:text-3xl font-cursive"
              >
                {" "}
                COFFEE HOUSE
              </a>
              <p className="pt-4">
                Cà phê thủ công, Không gian ấm cúng,<br></br>
                Khoảnh khắc khó quên - Nơi trốn thoát <br></br>
                Espresso hoàn hảo của bạn
              </p>

              <a
                href="#"
                target="_blank"
                className="inline-block bg-[#3d2517] py-2 px-4 mt-5 text-sm rounded-full"
              ></a>
            </div>

            {/* Footer Link*/}
            <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
              {/*First col Link*/}
              <div className="py-8 px-4">
                <h1 className="text-xl font-semibold sm:text-left mb-3">
                  Tổng quan
                </h1>
                <ul className="space-y-3">
                  {FooterLinks.map((data, index) => (
                    <li key={index}>
                      <a
                        href={data.link}
                        className="inline-block hover:scale-105 duration-200"
                      >
                        {data.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/*Second col link*/}
              <div className="py-8 px-4">
                <h1 className="text-xl font-semibold sm:text-left mb-3">
                  Quick Links
                </h1>
                <ul className="space-y-3">
                  {FooterLinks.map((data, index) => (
                    <li key={index}>
                      <a
                        href={data.link}
                        className="inline-block hover:scale-105 duration-200"
                      >
                        {data.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/*Company Address Section*/}
              <div className="py-8 px-4 col-span-2 sm:col-auto">
                <h1 className="text-xl font-semibold sm:text-left mb-3">
                  Address
                </h1>
                <div>
                  <p className="mb-3">
                    Thành phố Thủ Đức, Thành phố Hồ Chí Minh
                  </p>
                  <p>+84337972340</p>

                  {/*Social Link*/}
                  <div className="space-x-3 mt-6">
                    <a href="https://www.facebook.com/dinhnguyenminhhoang">
                      <FaFacebook className="text-3xl inline-block hover:scale-105 duration-200" />
                    </a>
                    <a href="https://www.facebook.com/dinhnguyenminhhoang">
                      <FaLinkedin className="text-3xl inline-block hover:scale-105 duration-200" />
                    </a>
                    <a href="https://www.facebook.com/dinhnguyenminhhoang">
                      <FaInstagram className="text-3xl inline-block hover:scale-105 duration-200" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
