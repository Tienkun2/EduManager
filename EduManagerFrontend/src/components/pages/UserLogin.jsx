import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

const UserLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      if (result.success) {
        if (!result.data.isAdmin) {
          console.log('Calling navigate to /user/dashboard');
          navigate('/user/dashboard', { replace: true });
          console.log('Navigate called');
        } else {
          setError('Vui lòng sử dụng trang đăng nhập admin tại /admin/login');
          form.resetFields();
        }
      } else {
        setError(result.error || 'Đăng nhập không thành công');
        form.resetFields();
      }
    } catch (err) {
      console.error('Login error:', err);
      // Check if the error is due to a locked account
      if (err.response?.data?.code === 1007) {
        setError(err.response.data.message || 'Tài khoản của bạn đã bị khóa');
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập');
      }
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Content
        style={{
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Card
          style={{
            maxWidth: 400,
            width: '100%',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
            Đăng nhập
          </Title>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 16 }}
            />
          )}
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ marginTop: 8 }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                disabled={loading}
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
                disabled={loading}
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{ borderRadius: 4 }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Text style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
              {/* Chưa có tài khoản?{' '}
              <a onClick={() => navigate('/register')}>Đăng ký</a> */}
            </Text>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default UserLogin;