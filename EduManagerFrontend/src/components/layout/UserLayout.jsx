import React, { useState, useEffect, Component } from 'react';
import { Layout, Menu, Button, Typography, Card, message, Dropdown, Spin, List, Modal,Badge, Tag } from 'antd';
import { HomeOutlined, CalendarOutlined, FileTextOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser, getToken, authRequest } from '../../services/authService';
import { getNotificationsForUser, markNotificationAsRead } from '../../services/notificationService';
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

    const fetchNotifications = async () => {
      try {
        const notifs = await getNotificationsForUser();
        setNotifications(notifs);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        message.error('Không thể tải thông báo. Vui lòng thử lại.');
      }
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

  const markAllNotificationsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.status === 'UNREAD');
      if (unreadNotifications.length === 0) {
        message.info('Không có thông báo nào chưa đọc.');
        return;
      }
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
      message.success('Đã đánh dấu tất cả thông báo là đã đọc.');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      message.error('Không thể đánh dấu tất cả đã đọc.');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (notification.status === 'UNREAD') {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, status: 'READ' } : n
          )
        );
        message.success('Đã đánh dấu thông báo là đã đọc.');
      }
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      message.error('Không thể đánh dấu thông báo là đã đọc.');
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/user/schedules')) return 'schedules';
    if (path.includes('/user/leave-requests')) return 'leave-requests';
    if (path.includes('/user/feedbacks')) return 'feedbacks';
    return 'dashboard';
  };

  const isTeamLead = user?.roles?.includes('ROLE_TEAM_LEAD');

  // Hàm xác định màu sắc cho từng loại thông báo
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'SYSTEM':
        return 'blue';
      case 'PROMOTION':
        return 'green';
      case 'SUPPORT':
        return 'purple';
      case 'FEEDBACK':
        return 'orange';
      default:
        return 'default';
    }
  };

  const notificationMenu = (
    <Card style={{ width: 400, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>Thông báo</Text>
        {notifications.some((n) => n.status === 'UNREAD') && (
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
              padding: '12px 8px',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
              background: item.status === 'UNREAD' ? '#e6f7ff' : 'white',
            }}
            onClick={() => handleNotificationClick(item)}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong={item.status === 'UNREAD'} type={item.status === 'READ' ? 'secondary' : ''}>
                    {item.title}
                  </Text>
                  <Tag color={getNotificationTypeColor(item.type)}>{item.type}</Tag>
                </div>
              }
              description={
                <div>
                  <Text>{item.content}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
              }
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
          <Menu.Item key="feedbacks" icon={<FileTextOutlined />} aria-label="Đơn xin nghỉ phép">
            Phản hồi của bạn
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
            <Badge count={notifications.filter((n) => n.status === 'UNREAD').length} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ marginRight: 16 }}
                aria-label="Thông báo"
              />
            </Badge>
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