import { Layout, Menu, Avatar, Badge, Dropdown, Typography } from "antd";
import { DashboardOutlined, PlusSquareOutlined, SearchOutlined, UserOutlined, LogoutOutlined, SettingOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./DashboardLayout.css";
//images & logo
import logo from "../../assets/images/Preproute-logo.png";
import avator from "../../assets/images/Avator.png"
import notify from "../../assets/icons/Vector.svg"
import aero from "../../assets/images/Aero.png";
//icons
import dash from '../../assets/icons/dash.svg';
import edit from "../../assets/icons/edit.svg";
import track from '../../assets/icons/track.svg';
import chap_1 from '../../assets/icons/approval.svg';
import chap_2 from "../../assets/icons/Usermanagement.svg";
import chap_3 from "../../assets/icons/cs.svg";
import chap_4 from "../../assets/icons/subscription.svg";
import chap_5 from "../../assets/icons/setting.svg";
import chap_6 from "../../assets/icons/payment.svg";
import chap_7 from "../../assets/icons/reward.svg";
import chap_8 from "../../assets/icons/resources.svg";
import chap_9 from "../../assets/icons/profile.svg";
import chap_10 from "../../assets/icons/management.svg";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/*ICON EXPORT */

export const DASHBOARD_ICONS = {
  dashboard: <DashboardOutlined />,
  createTest: <PlusSquareOutlined />,
  testTracking: <SearchOutlined />,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hideSidebar?: boolean;
  minimalHeader?: boolean;
  customSidebarItems?: any[];

  onCustomSidebarItemClick?: (
    key: string
  ) => void;
  selectedCustomKey?: string;
  showOriginalMenu?: boolean;
  sidebarMenuClassName?: string;
  totalQuestionsCount?: number;
}
const user = JSON.parse(localStorage.getItem("user") || "{}");
export default function DashboardLayout({
  children,
  style,
  hideSidebar = false,
  customSidebarItems,
  onCustomSidebarItemClick,
  selectedCustomKey,
  totalQuestionsCount,
}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const location = useLocation();

  const [collapsed, _setCollapsed] =
    useState(false);

  const selectedKey = location.pathname;
  const totalQuestions = totalQuestionsCount || customSidebarItems?.length || 0;

  /* CHECK MCQ PAGE */

  const isMCQPage =
    customSidebarItems &&
    customSidebarItems.length > 0;

  /*PROFILE MENU  */

  const profileMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Profile",
      },

      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Settings",
      },

      {
        type: "divider" as const,
      },

      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        danger: true,
      },
    ],
  };

  /* MENU CLICK */

  const handleMenuClick = ({
    key,
  }: {
    key: string;
  }) => {
    if (
      customSidebarItems &&
      onCustomSidebarItemClick &&
      key.startsWith("question-")
    ) {
      onCustomSidebarItemClick(key);

      return;
    }

    navigate(key);
  };

  /*  SELECTED KEY */

  const getSelectedKey = () => {
    if (
      customSidebarItems &&
      selectedCustomKey
    ) {
      return selectedCustomKey;
    }

    return selectedKey;
  };

  const handleQuestionMenuClick = ({ key }: { key: string }) => {
  if (onCustomSidebarItemClick) {
    onCustomSidebarItemClick(key);
  }
};

  return (
    <Layout className="layout-container">
      {/* HEADER  */}

      <Header className="top-navbar">
        <div className="navbar-left">


          <img
            src={logo}
            alt="logo"
            className="navbar-logo-img"
          />
        </div>

        <div className="navbar-right">

          <div className="notification-box">
            <Badge
              dot
              offset={[-3, 2]}  // Adjust position as needed
              style={{ backgroundColor: '#0c9d61' }}  // Green color
              size="medium"
            >
              <img src={notify} style={{ width: '15px' }} />
            </Badge>
          </div>


          <Dropdown
            menu={profileMenu}
            trigger={["click"]}
          >
            <div className="profile-wrapper">
              <Avatar
                size={42}
                src={avator}
                className="Profile-img"
              />

              <div className="profile-info">
                <Text strong>{user.name || "Admin User"}</Text>
                <Text type="secondary">{user.role || 'Administrator'}</Text>
              </div>

              <img src={aero} />
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/*  SIDEBAR  */}

        {!hideSidebar && (
          <Sider
            width={isMCQPage ? 290 : 250}
            theme="light"
            className="sidebar"
            collapsed={collapsed}
            trigger={null}
          >
            {/* NORMAL SIDEBAR */}

            {!isMCQPage && (
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                className="custom-menu"
                items={[
                  {
                    key: "/dashboard",
                    icon:<img src={dash}/>,
                    label: "Dashboard",
                  },

                  {
                    key: "/create-test",
                    icon :<img src={edit}/>,
                    label: "Create Test",
                  },

                  {
                    key: "/test-tracking",
                    icon :<img src={track}/>,
                    label: "Test Tracking",
                  },
                ]}
              />
            )}

            {/*MCQ SIDEBAR*/}

            {isMCQPage && (
              <div className="sidebar-layout">
                {/* LEFT ICON MENU */}

                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  onClick={handleQuestionMenuClick}
                  className="icon-menu"
                  items={[
                    {
                      key: "/dashboard",
                      icon:<img src={dash}/>,
                      label: "",
                    },

                    {
                      key: "/create-test",
                      icon :<img src={edit}/>,
                      label: "",
                    },

                    {
                      key: "/test-tracking",
                      icon :<img src={chap_1}/>,
                      label: "",
                    },

                    {
                      key: "/analytics",
                      icon :<img src={chap_8}/>,
                      label: "",
                    },

                    {
                      key: "/notes",
                      icon :<img src={chap_3}/>,
                      label: "",
                    },

                    {
                      key: "/chapters",
                      icon :<img src={chap_2}/>,
                      label: "",
                    },
                    {
                      key: "/files",
                      icon :<img src={chap_9}/>,
                      label: "",
                    },
                    {
                      key: "/files",
                      icon :<img src={chap_10}/>,
                      label: "",
                    },

                    {
                      key: "/settings",
                      icon :<img src={chap_4}/>,
                      label: "",
                    },

                    {
                      key: "/files",
                      icon :<img src={chap_5}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={chap_5}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={chap_4}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={chap_6}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={chap_7}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={notify}/>,
                      label: "",
                    },
                     {
                      key: "/files",
                      icon :<img src={chap_5}/>,
                      label: "",
                    },
                    
                  ]}
                />

                {/* RIGHT QUESTIONS */}

                <div className="question-section">
                  <div className="question-title">
                    <span>
                      Questions
                    </span>
                    <DoubleRightOutlined style={{ marginLeft: '100px' }} />
                  </div>
                  <span>Total Questions: {totalQuestions}</span>

                  <Menu
                    mode="inline"
                    selectedKeys={[
                      getSelectedKey(),
                    ]}
                    items={
                      customSidebarItems
                    }
                    onClick={
                      handleMenuClick
                    }
                    className="question-menu"
                  />
                </div>
              </div>
            )}
          </Sider>
        )}

        {/* CONTENT  */}

        <Content
          className={`content-area ${hideSidebar
              ? "full-width"
              : ""
            }`}
          style={style}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}