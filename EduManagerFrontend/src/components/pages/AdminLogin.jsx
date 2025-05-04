import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, isAuthenticated , checkAdminRole } from '../../services/authService';
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const AdminLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  useEffect(() => {
    // Nếu đã đăng nhập và có quyền ADMIN, chuyển hướng đến /admin/users
    if (isAuthenticated('ADMIN') && (location.pathname === '/admin/login' || location.pathname === '/admin')) {
      navigate('/admin/users', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        const token = result.data.token;
        const hasAdminRole = checkAdminRole(token);
        if (hasAdminRole) {
          // Lưu token và chuyển hướng nếu có quyền ADMIN
          localStorage.setItem('auth_token', token); // Sử dụng TOKEN_KEY
          localStorage.setItem('refresh_token', token); // Sử dụng REFRESH_TOKEN_KEY
          navigate('/admin/users', { replace: true });
        } else {
          // Nếu không có quyền ADMIN, không lưu token và hiển thị lỗi
          setError('Bạn cần tài khoản người quản trị để đăng nhập.');
          form.resetFields();
        }
      } else {
        setError(result.error || 'Đăng nhập không thành công');
        form.resetFields();
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          style={{
            width: 400,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>
              Admin Login
            </Title>
          </div>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}
          <Form form={form} name="login" onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Nhập email"
                size="large"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Nhập mật khẩu"
                size="large"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%', height: 40 }}
                size="large"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminLogin;