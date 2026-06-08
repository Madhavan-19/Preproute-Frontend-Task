import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Typography,
} from "antd";

import {
  DashboardOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BookOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import "./DashboardLayout.css";

import logo from "../../assets/images/Preproute-logo.png";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/* ================= ICON EXPORTS ================= */

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

  /* ================= CHECK MCQ PAGE ================= */

  const isMCQPage =
    customSidebarItems &&
    customSidebarItems.length > 0;

  /* ================= PROFILE MENU ================= */

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

  /* ================= MENU CLICK ================= */

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

  /* ================= SELECTED KEY ================= */

  const getSelectedKey = () => {
    if (
      customSidebarItems &&
      selectedCustomKey
    ) {
      return selectedCustomKey;
    }

    return selectedKey;
  };

  return (
    <Layout className="layout-container">
      {/* ================= HEADER ================= */}

      <Header className="top-navbar">
        <div className="navbar-left">
         

          <img
            src={logo}
            alt="logo"
            className="navbar-logo-img"
          />
        </div>

        <div className="navbar-right">
          <Badge count={3}>
            <div className="notification-box">
              <BellOutlined />
            </div>
          </Badge>

          <Dropdown
            menu={profileMenu}
            trigger={["click"]}
          >
            <div className="profile-wrapper">
              <Avatar
                size={42}
                src="https://i.pravatar.cc/100"
              />

              <div className="profile-info">
                <Text strong>
                  Admin User
                </Text>

                <Text type="secondary">
                  Administrator
                </Text>
              </div>

              <DownOutlined />
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* ================= SIDEBAR ================= */}

        {!hideSidebar && (
          <Sider
            width={isMCQPage ? 290 : 250}
            theme="light"
            className="sidebar"
            collapsed={collapsed}
            trigger={null}
          >
            {/* ================= NORMAL SIDEBAR ================= */}

            {!isMCQPage && (
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                className="custom-menu"
                items={[
                  {
                    key: "/dashboard",
                    icon: (
                      <DashboardOutlined />
                    ),
                    label: "Dashboard",
                  },

                  {
                    key: "/create-test",
                    icon: (
                      <PlusSquareOutlined />
                    ),
                    label: "Create Test",
                  },

                  {
                    key: "/test-tracking",
                    icon: (
                      <SearchOutlined />
                    ),
                    label: "Test Tracking",
                  },
                ]}
              />
            )}

            {/* ================= MCQ SIDEBAR ================= */}

            {isMCQPage && (
              <div className="sidebar-layout">
                {/* LEFT ICON MENU */}

                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  onClick={handleMenuClick}
                  className="icon-menu"
                 items={[
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "",
  },

  {
    key: "/create-test",
    icon: <PlusSquareOutlined />,
    label: "",
  },

  {
    key: "/test-tracking",
    icon: <SearchOutlined />,
    label: "",
  },

  {
    key: "/analytics",
    icon: <BarChartOutlined />,
    label: "",
  },

  {
    key: "/notes",
    icon: <FileTextOutlined />,
    label: "",
  },

  {
    key: "/chapters",
    icon: <BookOutlined />,
    label: "",
  },

  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "",
  },

  {
    key: "/files",
    icon: <FolderOpenOutlined />,
    label: "",
  },
]}
                />

                {/* RIGHT QUESTIONS */}

                <div className="question-section">
                  <div className="question-title">
                    <QuestionCircleOutlined />

                    <span>
                      Questions
                    </span>
                    <span>Total Questions: {totalQuestions}</span>
                  </div>
                   
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

        {/* ================= CONTENT ================= */}

        <Content
          className={`content-area ${
            hideSidebar
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