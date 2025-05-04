import React, { useState, useEffect, Component } from 'react';
import { Layout, Menu, Button, Typography, Card, message, Badge, Dropdown, Spin, List, Modal } from 'antd';
import { HomeOutlined, CalendarOutlined, FileTextOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser, getToken, authRequest } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card style={{ textAlign: 'center', margin: '24px' }}>
          <Text type="danger">Đã xảy ra lỗi. Vui lòng thử lại sau.</Text>
        </Card>
      );
    }
    return this.props.children;
  }
}

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [sessionWarningVisible, setSessionWarningVisible] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState(60); // 60 seconds countdown

  useEffect(() => {
    const fetchUser = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = () => {
      // Mock API response
      const mockNotifications = [
        {
          id: 1,
          type: 'LEAVE',
          message: 'Đơn xin nghỉ phép từ 10/05/2025 đến 12/05/2025 đã được phê duyệt.',
          createdAt: '2025-05-03T10:00:00Z',
          read: false,
          link: '/user/leave-requests/1',
        },
        {
          id: 2,
          type: 'SCHEDULE',
          message: 'Lịch làm việc mới được thêm cho ngày 15/05/2025.',
          createdAt: '2025-05-03T09:30:00Z',
          read: false,
          link: '/user/schedules/15-05-2025',
        },
        {
          id: 3,
          type: 'SYSTEM',
          message: 'Hệ thống sẽ bảo trì vào 04/05/2025 từ 00:00 đến 02:00.',
          createdAt: '2025-05-02T15:00:00Z',
          read: true,
          link: null,
        },
      ];
      setNotifications(mockNotifications);
    };

    const checkSessionTimeout = () => {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expTime = decoded.exp * 1000; // Convert to milliseconds
          const now = Date.now();
          const timeLeft = expTime - now;
          // Show warning 5 minutes (300,000 ms) before expiration
          if (timeLeft > 0 && timeLeft <= 300000) {
            setSessionWarningVisible(true);
            setSessionCountdown(Math.floor(timeLeft / 1000));
          }
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }
    };

    fetchUser();
    fetchNotifications();
    checkSessionTimeout();

    // Check session every 30 seconds
    const interval = setInterval(checkSessionTimeout, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionWarningVisible) {
      const timer = setInterval(() => {
        setSessionCountdown((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionWarningVisible]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/user/login');
    } catch (err) {
      message.error('Đăng xuất thất bại. Vui lòng thử lại.');
      console.error('Logout error:', err);
    }
  };

  const handleRefreshSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authRequest('post', '/auth/refresh', { token: refreshToken });
      if (response.data && response.data.code === 46 && response.data.result.authenticated) {
        localStorage.setItem('auth_token', response.data.result.token);
        setSessionWarningVisible(false);
        message.success('Phiên làm việc đã được gia hạn.');
      } else {
        throw new Error('Invalid refresh token');
      }
    } catch (err) {
      message.error('Không thể gia hạn phiên. Vui lòng đăng nhập lại.');
      handleLogout();
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      navigate(notification.link);
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/user/schedules')) return 'schedules';
    if (path.includes('/user/leave-requests')) return 'leave-requests';
    return 'dashboard';
  };

  const isTeamLead = user?.roles?.includes('ROLE_TEAM_LEAD');

  const notificationMenu = (
    <Card style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>Thông báo</Text>
        {notifications.some((n) => !n.read) && (
          <Button
            type="link"
            size="small"
            onClick={markAllNotificationsRead}
            aria-label="Đánh dấu tất cả đã đọc"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
              cursor: item.link ? 'pointer' : 'default',
            }}
            onClick={() => handleNotificationClick(item)}
          >
            <List.Item.Meta
              title={
                <Text strong={!item.read} type={item.read ? 'secondary' : ''}>
                  {item.message}
                </Text>
              }
              description={dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
            />
          </List.Item>
        )}
        locale={{ emptyText: 'Không có thông báo nào.' }}
      />
    </Card>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        style={{ background: '#001529' }}
      >
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {loading ? (
            <Spin size="small" />
          ) : (
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              {collapsed ? 'Hệ thống' : `Xin chào, ${user?.fullName || 'Người dùng'}!`}
            </Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={({ key }) => navigate(`/user/${key}`)}
          style={{ fontSize: '16px' }}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />} aria-label="Trang chủ">
            Trang chủ
          </Menu.Item>
          <Menu.Item key="schedules" icon={<CalendarOutlined />} aria-label="Lịch làm việc">
            Lịch làm việc
          </Menu.Item>
          <Menu.Item key="leave-requests" icon={<FileTextOutlined />} aria-label="Đơn xin nghỉ phép">
            Đơn xin nghỉ phép
          </Menu.Item>
          {isTeamLead && (
            <Menu.Item key="team-management" icon={<HomeOutlined />} aria-label="Quản lý đội nhóm">
              Quản lý đội nhóm
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginRight: 16 }}
              aria-label={collapsed ? 'Mở sidebar' : 'Đóng sidebar'}
            />
            <Title level={4} style={{ margin: 0 }}>
              Hệ thống quản lý nhân sự
            </Title>
          </div>
          <div>
            <Dropdown overlay={notificationMenu} trigger={['click']}>
              <Button
                type="text"
                icon={
                  <Badge count={notifications.filter((n) => !n.read).length}>
                    <BellOutlined />
                  </Badge>
                }
                style={{ marginRight: 16 }}
                aria-label="Thông báo"
              />
            </Dropdown>
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              aria-label="Đăng xuất"
            >
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '24px', flex: 1 }}>
          <ErrorBoundary>
            <Card style={{ borderRadius: 8, minHeight: 'calc(100vh - 136px)' }}>
              {children}
            </Card>
          </ErrorBoundary>
        </Content>
      </Layout>
      <Modal
        title="Cảnh báo hết phiên"
        open={sessionWarningVisible}
        onCancel={handleLogout}
        footer={[
          <Button key="logout" onClick={handleLogout}>
            Đăng xuất
          </Button>,
          <Button key="refresh" type="primary" onClick={handleRefreshSession}>
            Gia hạn phiên
          </Button>,
        ]}
      >
        <Text>Phiên làm việc của bạn sẽ hết hạn sau {sessionCountdown} giây. Bạn có muốn gia hạn phiên không?</Text>
      </Modal>
    </Layout>
  );
};

export default UserLayout;