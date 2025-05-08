import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Alert, Descriptions, Avatar, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined, FileTextOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import { getUserInfo } from '../../services/userService';
import moment from 'moment';

const { Title, Text } = Typography;

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isAuthenticated('USER')) {
          navigate('/user/login');
          return;
        }
        const profile = await getUserInfo();
        setUser(profile);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          navigate('/user/login');
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
        }
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  return (
    <Card>
      <Row justify="space-between" align="middle">
        <Title level={2}>Trang chủ</Title>
      </Row>
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}
      {user ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Chào mừng, {user.fullName || user.email || 'Người dùng'}!
              </Title>
              <Text type="secondary">Đăng nhập với {user.email || 'Không xác định'}</Text>
            </Col>
          </Row>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            size="middle"
            labelStyle={{ fontWeight: 'bold', width: 180 }}
            contentStyle={{ color: '#595959' }}
          >
            <Descriptions.Item label="Vai trò">
              {user.roles?.length > 0 ? (user.roles[0].name === 'USER' ? 'Nhân viên' : user.roles[0].name) : 'Không xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng ban">{user.departmentName || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Loại nhân viên">{user.staffTypeName || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phoneNumber || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{user.address || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{user.gender || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {user.dateOfBirth ? moment(user.dateOfBirth).format('DD/MM/YYYY') : 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="CMND/CCCD">{user.identityCard || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{user.status || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {user.createdDate ? moment(user.createdDate).format('DD/MM/YYYY') : 'Không có'}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                size="large"
                onClick={() => navigate('/user/schedules')}
              >
                Xem lịch làm việc
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                size="large"
                onClick={() => navigate('/user/leave-requests')}
              >
                Quản lý đơn xin nghỉ phép
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<LockOutlined />}
                size="large"
                onClick={() => navigate('/user/change-password')}
              >
                Đổi mật khẩu
              </Button>
            </Col>
          </Row>
        </Space>
      ) : (
        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
          Đang tải thông tin người dùng...
        </Text>
      )}
    </Card>
  );
};

export default UserDashboard;