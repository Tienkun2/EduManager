// import React from 'react';
// import { Layout, Menu, Breadcrumb, Button, Avatar, Badge, Dropdown } from 'antd';
// import { UserOutlined, TeamOutlined, FileOutlined, CalendarOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// import { logout } from '../../services/authService';

// const { Header, Content, Sider } = Layout;

// const AdminLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/admin/login');
//   };

//   // Sample notification data
//   const notifications = [
//     { id: 1, message: 'New leave request from John Doe', time: '2 hours ago' },
//     { id: 2, message: 'User Jane Smith updated profile', time: '5 hours ago' },
//     { id: 3, message: 'Attendance report generated', time: 'Yesterday' },
//   ];

//   const notificationMenu = (
//     <Menu
//       style={{ width: 300, borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)' }}
//     >
//       {notifications.length === 0 ? (
//         <Menu.Item key="0" disabled>
//           No notifications
//         </Menu.Item>
//       ) : (
//         notifications.map((notification) => (
//           <Menu.Item key={notification.id}>
//             <div>
//               <p style={{ margin: 0, fontWeight: 500 }}>{notification.message}</p>
//               <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>{notification.time}</p>
//             </div>
//           </Menu.Item>
//         ))
//       )}
//     </Menu>
//   );

//   const items = [
//     {
//       key: '/admin/users',
//       icon: <UserOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/users" style={{ color: '#ffffff' }}>Quản lý nhân sự</NavLink>,
//     },
//     {
//       key: '/admin/staff-types',
//       icon: <TeamOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/staff-types" style={{ color: '#ffffff' }}>Quản lý loại nhân sự</NavLink>,
//     },
//     {
//       key: '/admin/departments',
//       icon: <FileOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/departments" style={{ color: '#ffffff' }}>Quản lý phòng ban</NavLink>,
//     },
//     {
//       key: '/admin/schedules',
//       icon: <CalendarOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/schedules" style={{ color: '#ffffff' }}>Quản lý lịch làm việc</NavLink>,
//     },
//     {
//       key: '/admin/leave-requests',
//       icon: <FileOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/leave-requests" style={{ color: '#ffffff' }}>Quản lý đơn nghỉ phép</NavLink>,
//     },
//     {
//       key: '/admin/attendances',
//       icon: <FileOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/attendances" style={{ color: '#ffffff' }}>Quản lý chấm công</NavLink>,
//     },
//     {
//       key: '/admin/notifications',
//       icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/notifications" style={{ color: '#ffffff' }}>Quản lý thông báo</NavLink>,
//     },
//     {
//       key: '/admin/broadcast-notifications',
//       icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/broadcast-notifications" style={{ color: '#ffffff' }}>Quản lý thông báo hàng loạt</NavLink>,
//     },y
//     {
//       key: '/admin/statistics',
//       icon: <FileOutlined style={{ color: '#ffffff' }} />,
//       label: <NavLink to="/admin/statistics" style={{ color: '#ffffff' }}>Thống kê</NavLink>,
//     },
//   ];

//   const breadcrumbItems = [
//     {
//       title: <span style={{ color: '#d4380d' }}>Admin</span>,
//     },
//     {
//       title: <span style={{ color: '#531dab' }}>{location.pathname.split('/').pop() || 'Dashboard'}</span>,
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider
//         collapsible
//         theme="light"
//         width={260}
//         style={{
//           background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)',
//           boxShadow: '4px 0 12px rgba(0, 0, 0, 0.2)',
//           transition: 'all 0.3s ease',
//           color: '#ffffff',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <div
//           className="logo"
//           style={{
//             height: '80px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: 'linear-gradient(90deg, #1a2a6c, #b21f1f)',
//             color: '#ffffff',
//             fontSize: '24px',
//             fontWeight: 'bold',
//             borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
//           }}
//         >
//           <Avatar size={40} style={{ backgroundColor: '#ffffff', color: '#1a2a6c', marginRight: 8 }}>A</Avatar>
//           Admin
//         </div>
//         <Menu
//           theme="dark"
//           mode="inline"
//           defaultSelectedKeys={[location.pathname]}
//           selectedKeys={[location.pathname]}
//           items={items}
//           style={{
//             borderRight: 0,
//             background: 'transparent',
//             color: '#ffffff',
//             flex: 1,
//           }}
//           inlineIndent={20}
//           overflowedIndicator={<span style={{ color: '#ffffff' }}>More</span>}
//         />
//         <div
//           style={{
//             padding: '16px',
//             textAlign: 'center',
//             borderTop: '1px solid rgba(255, 255, 255, 0.3)',
//           }}
//         >
//           <Button
//             type="primary"
//             icon={<LogoutOutlined />}
//             onClick={handleLogout}
//             danger
//             block
//             style={{
//               background: 'linear-gradient(90deg, #d4380d, #f5222d)',
//               border: 'none',
//               transition: 'all 0.3s ease',
//               color: '#ffffff',
//             }}
//             onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
//             onMouseLeave={(e) => (e.target.style.opacity = '1')}
//           >
//             Đăng xuất
//           </Button>
//         </div>
//       </Sider>
//       <Layout>
//         <Header
//           style={{
//             padding: '0 24px',
//             background: '#ffffff',
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             height: '64px',
//             position: 'sticky',
//             top: 0,
//             zIndex: 1,
//           }}
//         >
//           <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
//           <Dropdown overlay={notificationMenu} trigger={['click']}>
//             <Badge count={notifications.length} offset={[-10, 10]}>
//               <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#1a2a6c' }} />
//             </Badge>
//           </Dropdown>
//         </Header>
//         <Content
//           style={{
//             padding: '24px',
//             margin: '0 16px',
//             background: '#fafafa',
//             borderRadius: '8px',
//             minHeight: 'calc(100vh - 64px)',
//             transition: 'all 0.3s ease',
//           }}
//         >
//           <div
//             style={{
//               padding: 24,
//               background: '#ffffff',
//               borderRadius: '8px',
//               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
//               minHeight: 360,
//             }}
//           >
//             {location.pathname === '/admin' && <Statistic />}
//             {children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AdminLayout;
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Avatar, Badge, Dropdown } from 'antd';
import { UserOutlined, TeamOutlined, FileOutlined, CalendarOutlined, LogoutOutlined, BellOutlined, NotificationOutlined } from '@ant-design/icons';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logout, isAuthenticated } from '../../services/authService';
import { getNotificationsForUser } from '../../services/notificationService';

const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Lấy danh sách thông báo từ API
  useEffect(() => {
    if (isAuthenticated('ADMIN')) {
      getNotificationsForUser('admin123') // Giả sử admin123 là ID của admin
        .then((data) => {
          setNotifications(data);
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    }
  }, []);

  const notificationMenu = (
    <Menu
      style={{ width: 300, borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)' }}
    >
      {notifications.length === 0 ? (
        <Menu.Item key="0" disabled>
          No notifications
        </Menu.Item>
      ) : (
        notifications.map((notification) => (
          <Menu.Item key={notification.id}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{notification.title}</p>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>{notification.createdAt}</p>
            </div>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  const items = [
    {
      key: '/admin/users',
      icon: <UserOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/users" style={{ color: '#ffffff' }}>Quản lý nhân sự</NavLink>,
    },
    {
      key: '/admin/staff-types',
      icon: <TeamOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/staff-types" style={{ color: '#ffffff' }}>Quản lý loại nhân sự</NavLink>,
    },
    {
      key: '/admin/departments',
      icon: <FileOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/departments" style={{ color: '#ffffff' }}>Quản lý phòng ban</NavLink>,
    },
    {
      key: '/admin/schedules',
      icon: <CalendarOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/schedules" style={{ color: '#ffffff' }}>Quản lý lịch làm việc</NavLink>,
    },
    {
      key: '/admin/leave-requests',
      icon: <FileOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/leave-requests" style={{ color: '#ffffff' }}>Quản lý đơn nghỉ phép</NavLink>,
    },
    {
      key: '/admin/attendances',
      icon: <FileOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/attendances" style={{ color: '#ffffff' }}>Quản lý chấm công</NavLink>,
    },
    {
      key: '/admin/notifications',
      icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/notifications" style={{ color: '#ffffff' }}>Quản lý thông báo</NavLink>,
    },
    {
      key: '/admin/feedbacks',
      icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/feedbacks" style={{ color: '#ffffff' }}>Quản lý phản hồi</NavLink>,
    },
    // {
    //   key: '/admin/broadcast-notifications',
    //   icon: <NotificationOutlined style={{ color: '#ffffff' }} />,
    //   label: <NavLink to="/admin/broadcast-notifications" style={{ color: '#ffffff' }}>Quản lý thông báo hàng loạt</NavLink>,
    // },
    {
      key: '/admin/statistics',
      icon: <FileOutlined style={{ color: '#ffffff' }} />,
      label: <NavLink to="/admin/statistics" style={{ color: '#ffffff' }}>Thống kê</NavLink>,
    },
  ];

  const breadcrumbItems = [
    {
      title: <span style={{ color: '#d4380d' }}>Admin</span>,
    },
    {
      title: <span style={{ color: '#531dab' }}>{location.pathname.split('/').pop() || 'Dashboard'}</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme="light"
        width={260}
        style={{
          background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)',
          boxShadow: '4px 0 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="logo"
          style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, #1a2a6c, #b21f1f)',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Avatar size={40} style={{ backgroundColor: '#ffffff', color: '#1a2a6c', marginRight: 8 }}>A</Avatar>
          Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={items}
          style={{
            borderRight: 0,
            background: 'transparent',
            color: '#ffffff',
            flex: 1,
          }}
          inlineIndent={20}
          overflowedIndicator={<span style={{ color: '#ffffff' }}>More</span>}
        />
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
            block
            style={{
              background: 'linear-gradient(90deg, #d4380d, #f5222d)',
              border: 'none',
              transition: 'all 0.3s ease',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
          <Dropdown overlay={notificationMenu} trigger={['click']}>
            <Badge count={notifications.length} offset={[-10, 10]}>
              <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#1a2a6c' }} />
            </Badge>
          </Dropdown>
        </Header>
        <Content
          style={{
            padding: '24px',
            margin: '0 16px',
            background: '#fafafa',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 64px)',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              padding: 24,
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;