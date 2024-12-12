import logo from "@/assets/website/coffee_logo.ico";
import useNotification from "@/hooks/NotiHook";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const { Sider } = Layout;
const { SubMenu } = Menu;

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState();
  const [isLogger, setisLogger] = useState(false);
  const openNotification = useNotification();
  const navigate = useNavigate();
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
    navigate("/admin/login");
  };
  const adminLinks = [
    { path: "/manager-summary", label: "DASBOARD" },
    { path: "/manager-staffs", label: "MANAGER STAFF" },
    { path: "/manager-customers", label: "MANAGER CUSTOMER" },
    { path: "/manager-drinks", label: "MANAGER DRINKS" },
    { path: "/manager-branches", label: "MANAGER BRANCHES" },
    { path: "/manager-vouchers", label: "MANAGER VOUCHERS" },
    { path: "/manager-categories", label: "STAFF CATEGORIES" },
  ];
  const staffLinks = [
    { path: "/manager-orders", label: "STAFF ORDER" },
    { path: "/manager-ratings", label: "STAFF RATINGS" },
    { path: "/manager-ingredients", label: "MANAGER INGREDIENTS" },
  ];
  return userData ? (
    <Layout className="flex-none pt-3 border-r border-[#ccc] h-screen overflow-y-auto">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
      >
        <div className="logo" />
        <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item
            onClick={() => navigate("/")}
            key="1"
            style={{
              height: "200px",
              background: "white",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Menu.Item>

          {userData.role === "ROLE_ADMIN" ? (
            <SubMenu
              key="sub1"
              icon={<MdOutlineAdminPanelSettings size={20} />}
              title="Admin"
            >
              {adminLinks.map((link, index) => (
                <Menu.Item
                  key={`admin-${index}`}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Menu.Item>
              ))}
            </SubMenu>
          ) : null}
          <SubMenu key="sub3" icon={<UserOutlined />} title="Staff">
            {staffLinks.map((link, index) => (
              <Menu.Item
                key={`staff-${index}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </Menu.Item>
            ))}
          </SubMenu>
          <Menu.Item
            key="logout"
            icon={<UserOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  ) : null;
};

export default SidebarAdmin;
