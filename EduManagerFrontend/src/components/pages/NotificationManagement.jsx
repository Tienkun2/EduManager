import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Select, Modal, message, App } from 'antd';
import {
  createNotification,
  getAllNotification,
  updateNotificationInfo,
  deleteNotification,
} from '../../services/notificationService';
import { getAllUsers } from '../../services/userService';
import { isAuthenticated, getCurrentUser } from '../../services/authService';
import { StyleProvider } from '@ant-design/cssinjs';

const { Option } = Select;

// Ánh xạ NotificationType sang tiếng Việt
const notificationTypeMap = {
  SYSTEM: 'Hệ thống',
  PROMOTION: 'Khuyến mãi',
  SUPPORT: 'Hỗ trợ',
  FEEDBACK: 'Phản hồi',
};

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]); // Danh sách thông báo đã lọc
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [senderId, setSenderId] = useState('');
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [searchText, setSearchText] = useState(''); // Tìm kiếm theo tiêu đề/nội dung
  const [filterType, setFilterType] = useState(''); // Lọc theo loại thông báo

  // Kiểm tra quyền admin, lấy senderId và danh sách users
  useEffect(() => {
    if (isAuthenticated('ADMIN')) {
      const user = getCurrentUser();
      if (user && user.id) {
        setSenderId(user.id);
        form.setFieldsValue({ senderId: user.id });
      } else {
        message.error('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!');
      }
      fetchNotifications();
      fetchUsers();
    } else {
      message.error('Bạn không có quyền truy cập trang này!');
    }
  }, []);

  // Lọc thông báo khi searchText hoặc filterType thay đổi
  useEffect(() => {
    let filtered = notifications;
    
    // Lọc theo tìm kiếm
    if (searchText) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
          notification.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo loại
    if (filterType) {
      filtered = filtered.filter((notification) => notification.type === filterType);
    }

    setFilteredNotifications(filtered);
  }, [searchText, filterType, notifications]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng!');
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getAllNotification();
      setNotifications(data);
    } catch (error) {
      message.error('Không thể tải danh sách thông báo!');
    }
    setLoading(false);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const notificationData = { ...values };
      if (editingNotificationId) {
        await updateNotificationInfo(editingNotificationId, notificationData);
        message.success('Cập nhật thông báo thành công!');
      } else {
        await createNotification(notificationData);
        message.success('Tạo thông báo mới thành công!');
      }
      fetchNotifications();
      setIsModalVisible(false);
      form.resetFields();
      form.setFieldsValue({ senderId });
      setEditingNotificationId(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Lỗi khi ${editingNotificationId ? 'cập nhật' : 'tạo'} thông báo!`;
      message.error(errorMessage);
    }
  };

  const handleEdit = (notification) => {
    form.setFieldsValue({
      senderId,
      receiverId: notification.receiver?.id || '',
      title: notification.title,
      content: notification.content,
      type: notification.type,
    });
    setEditingNotificationId(notification.id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      message.success('Xóa thông báo thành công!');
      fetchNotifications();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi xóa thông báo!';
      message.error(errorMessage);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => notificationTypeMap[type] || type, // Hiển thị tiếng Việt
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <StyleProvider>
      <App>
        <div>
          <h2>Quản lý thông báo</h2>
          <div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Lọc theo loại thông báo"
              value={filterType}
              onChange={(value) => setFilterType(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="">Tất cả</Option>
              <Option value="SYSTEM">Hệ thống</Option>
              <Option value="PROMOTION">Khuyến mãi</Option>
              <Option value="SUPPORT">Hỗ trợ</Option>
              <Option value="FEEDBACK">Phản hồi</Option>
            </Select>
            <Button
              type="primary"
              onClick={() => {
                setEditingNotificationId(null);
                form.resetFields();
                form.setFieldsValue({ senderId });
                setIsModalVisible(true);
              }}
            >
              Tạo thông báo mới
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredNotifications}
            loading={loading}
            rowKey="id"
          />
          <Modal
            title={editingNotificationId ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
              form.setFieldsValue({ senderId });
              setEditingNotificationId(null);
            }}
            onOk={() => form.submit()}
            okText="Lưu"
            cancelText="Hủy"
          >
            <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
              <Form.Item
                name="senderId"
                hidden
                initialValue={senderId}
                rules={[{ required: true, message: 'ID người gửi không được để trống!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Người gửi">
                <Input value="ADMIN" disabled />
              </Form.Item>
              <Form.Item name="receiverId" label="Người nhận">
                <Select
                  placeholder="Chọn hoặc tìm kiếm người nhận (để trống nếu gửi tất cả)"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option.children || '').toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.fullName || `Người dùng ${user.id}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề thông báo" />
              </Form.Item>
              <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
              >
                <Input.TextArea placeholder="Nhập nội dung thông báo" />
              </Form.Item>
              <Form.Item
                name="type"
                label="Loại thông báo"
                rules={[{ required: true, message: 'Vui lòng chọn loại thông báo!' }]}
              >
                <Select placeholder="Chọn loại thông báo">
                  <Option value="SYSTEM">Hệ thống</Option>
                  <Option value="PROMOTION">Khuyến mãi</Option>
                  <Option value="SUPPORT">Hỗ trợ</Option>
                  <Option value="FEEDBACK">Phản hồi</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </App>
    </StyleProvider>
  );
};

export default NotificationManagement;