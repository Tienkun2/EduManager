import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { changePassword } from '../../services/userService';

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    setSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = values;

    try {
      // Call the API to change password
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      // Clear tokens and redirect to login after a short delay
      setTimeout(() => {
        logout();
        navigate('/user/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Error changing password:', err);
    }
  };

  return (
    <Card style={{ maxWidth: 500, margin: '40px auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Đổi Mật Khẩu
      </Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}
        {success && (
          <Alert
            message="Thành công"
            description={success}
            type="success"
            showIcon
            closable
            onClose={() => setSuccess(null)}
          />
        )}
        <Form
          form={form}
          name="change_password"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default ChangePassword;