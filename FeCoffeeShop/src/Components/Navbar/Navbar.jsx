import Logo from "@/assets/website/coffee_logo.png";
import useNotification from "@/hooks/NotiHook";
import { getInitials } from "@/utils/resuableFuc";
import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Menu,
  Input,
  List,
  Image,
} from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BiCartAdd, BiLogOut, BiUser } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { PiCashRegister } from "react-icons/pi";
import { TbMenuOrder } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { getDrink } from "../../service/drinks";
import { formatVND } from "../../utils/resuableFuc";
import useDebounce from "../../hooks/Debound";
const Menus = [
  {
    id: 1,
    name: "Sản phẩm",
    link: "/#ProductShow",
  },

  {
    id: 2,
    name: "Liên hệ",
    link: "/#footer",
  },
];

const Navbar = () => {
  const [userData, setUserData] = useState();
  const [isLogger, setisLogger] = useState(false);
  const openNotification = useNotification();
  const [cartInfo, setCartInfo] = useState([]);
  const [branchInfo, setBranchInfo] = useState({});
  const [keySearch, setKeySearch] = useState("");
  const [products, setProducts] = useState([]);
  const debouncedSearch = useDebounce(keySearch, 500);
  const navigator = useNavigate();
  useEffect(() => {
    const fetchDataDrink = async () => {
      if (debouncedSearch) {
        const response = await getDrink({
          listParam: {
            PageIndex: 1,
            PageSize: 1000,
            keySearch: debouncedSearch,
          },
        });
        if (response?.data?.Success) {
          setProducts(response.data?.ResultData?.List);
        }
      }
    };
    fetchDataDrink();
  }, [debouncedSearch]);
  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (token) {
      const data = jwtDecode(token);
      setUserData({
        fullname: data.fullname,
        phone: data.phone.trim(),
        username: data.username,
        role: data.role,
      });
      localStorage.setItem("isLogger", true);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          fullname: data.fullname,
          phone: data.phone.trim(),
          username: data.username,
        })
      );
      setisLogger(true);
    } else {
      localStorage.setItem("isLogger", false);
      setisLogger(false);
    }
  }, []);
  const handleLogout = () => {
    Cookies.remove("AccessToken");
    localStorage.clear();
    setisLogger(false);
    openNotification({ type: "info", description: "Đăng xuất thành công" });
  };
  useEffect(() => {
    const cartLocal = localStorage.getItem("cartInfo");
    const branchLocal = localStorage.getItem("branch");
    if (cartLocal) {
      setCartInfo(JSON.parse(cartLocal));
    }
    if (branchLocal) setBranchInfo(JSON.parse(branchLocal));
  }, [localStorage]);
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setKeySearch(searchValue);
  };
  const menu = (
    <Menu>
      {userData?.role === "ROLE_CUSTOMER" ? (
        <Menu.Item
          key="profile"
          icon={<BiUser />}
          onClick={() => navigator(`/profile`)}
        >
          Profile
        </Menu.Item>
      ) : (
        <Menu.Item
          key="manager"
          icon={<GrUserManager />}
          onClick={() => navigator(`/manager-drinks`)}
        >
          Manager
        </Menu.Item>
      )}
      <Menu.Item
        key="orders"
        icon={<TbMenuOrder />}
        onClick={() => navigator(`/orders`)}
      >
        Order
      </Menu.Item>
      <Menu.Item key="logout" icon={<BiLogOut />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="bg-gradient-to-r from-secondary to-secondary/90 text-white">
      {products.length > 0 && keySearch?.length > 0 ? (
        <div
          className="absolute inset-0 bg-transparent z-10"
          onClick={() => {
            setKeySearch("");
            setProducts([]);
          }}
        />
      ) : null}
      <div className="container py-2">
        <div className="flex justify-between items-center gap-4">
          <div>
            <Link
              to="/"
              className="font-bold text-2xl sm:text-3xl flex justify-center items-center gap-2 tracking-wider font-cursive"
            >
              <img src={Logo} alt="Logo" className="w-14" />
              COFFEE HOUSE
            </Link>
          </div>{" "}
          <div className="mx-4 relative w-[400px]">
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              value={keySearch}
              onChange={handleSearch}
              enterButton
              className="outline-none"
            />
            {products.length > 0 && keySearch?.length > 0 ? (
              <>
                <div className="absolute top-7 right-0 left-0 bottom-0 h-[400px] overflow-y-auto z-20">
                  <List
                    bordered
                    dataSource={products}
                    renderItem={(item) => (
                      <List.Item
                        onClick={() => navigator(`/product/${item.Id}`)}
                        className="flex items-center gap-4 !justify-start hover:bg-slate-200 duration-300 ease-in-out cursor-pointer"
                      >
                        <Image
                          src={item?.Image}
                          alt="image drink"
                          width={64}
                          height={64}
                          className="w-9 h-9 object-cover"
                        />
                        <div className="flex flex-col gap-2 items-start">
                          <span>{item.Name}</span>
                          <span>{formatVND(item?.MinPrice)}</span>
                        </div>
                      </List.Item>
                    )}
                    className="bg-white text-black mt-2 rounded"
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="flex justify-between items-center gap-4">
            <ul className="hidden sm:flex items-center gap-4">
              {Menus.map((data, index) => (
                <li key={index}>
                  <a
                    href={data.link}
                    className="inline-block  py-4 px-4 text-white/70 hover:text-white duration-200"
                  >
                    {data.name}
                  </a>
                </li>
              ))}
              <li>
                {branchInfo?.Name ? (
                  <a
                    href={"/branches"}
                    className="inline-block  py-4 px-4 text-white/70 hover:text-white duration-200"
                  >
                    {`Cửa hàng - ${branchInfo.Name}`}
                  </a>
                ) : (
                  <a
                    href={"/branches"}
                    className="inline-block  py-4 px-4 text-white/70 hover:text-white duration-200"
                  >
                    {`Cửa hàng`}
                  </a>
                )}
              </li>
            </ul>
            <button
              className="bg-primary/70 px-4 py-2 rounded-md hover:scale-105 duration-200 flex items-center gap-3 relative"
              onClick={() => {
                userData?.role === "ROLE_STAFF"
                  ? navigator("/carts/staff")
                  : navigator("/carts/customer");
              }}
            >
              Cart
              <BiCartAdd className="text-xl cursor-pointer" />
              {cartInfo?.length ? (
                <div className="absolute -top-1 -right-2 bg-[rgba(255,74,74,0.8)] px-2 rounded-full w-2 h-4"></div>
              ) : null}
            </button>
            {isLogger ? (
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <Button
                  shape="circle"
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    padding: "22px 16px",
                  }}
                  className="bg-primary text-white border border-secondary"
                >
                  {getInitials(userData?.username)}
                </Button>
              </Dropdown>
            ) : (
              <Flex align="center" gap={2}>
                <button
                  className="hover:scale-105 duration-200 flex items-center gap-2"
                  onClick={() => navigator("/login")}
                >
                  Login
                  <FaUserAlt className="cursor-pointer" size={16} />
                </button>
                <Divider type="vertical" className="bg-white" />
                <button
                  className="hover:scale-105 duration-200 flex items-center gap-2"
                  onClick={() => navigator("/register")}
                >
                  Register
                  <PiCashRegister className="cursor-pointer" size={16} />
                </button>
              </Flex>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
