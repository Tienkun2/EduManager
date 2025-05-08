import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Select, Modal, message } from 'antd';
import { createBroadcastNotification, getBroadcastNotificationById } from '../../services/broadcastNotificationService';
import { isAuthenticated } from '../../services/authService';

const { Option } = Select;

const BroadcastNotificationManagement = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated('ADMIN')) {
      // Giả lập danh sách thông báo hàng loạt (API không hỗ trợ lấy danh sách)
      fetchBroadcastDetails('broadcast1'); // Giả sử ID
    } else {
      message.error('Bạn không có quyền truy cập trang này');
    }
  }, []);

  const fetchBroadcastDetails = async (id) => {
    setLoading(true);
    try {
      const data = await getBroadcastNotificationById(id);
      setBroadcasts([data]); // Giả lập danh sách
    } catch (error) {
      message.error('Lỗi khi lấy thông tin thông báo hàng loạt');
    }
    setLoading(false);
  };

  const handleCreate = async (values) => {
    try {
      await createBroadcastNotification(values);
      message.success('Tạo thông báo hàng loạt thành công');
      fetchBroadcastDetails(values.notificationId); // Cập nhật danh sách
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo thông báo hàng loạt');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'ID thông báo', dataIndex: 'notificationId', key: 'notificationId' },
    { title: 'Vai trò đích', dataIndex: 'targetRole', key: 'targetRole' },
    { title: 'Phòng ban đích', dataIndex: 'targetDepartmentId', key: 'targetDepartmentId' },
    { title: 'Loại nhân viên đích', dataIndex: 'targetStaffTypeId', key: 'targetStaffTypeId' },
  ];

  return (
    <div>
      <h2>Quản lý thông báo hàng loạt</h2>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Tạo thông báo hàng loạt
      </Button>
      <Table
        columns={columns}
        dataSource={broadcasts}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="Tạo thông báo hàng loạt"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="notificationId"
            label="ID thông báo"
            rules={[{ required: true, message: 'Vui lòng nhập ID thông báo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="targetRole"
            label="Vai trò đích"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="STUDENT">USER</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="targetDepartmentId"
            label="ID phòng ban đích"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="targetStaffTypeId"
            label="ID loại nhân viên đích"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BroadcastNotificationManagement;