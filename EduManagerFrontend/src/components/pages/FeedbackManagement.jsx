import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllFeedbacks, getFeedbackById, updateFeedback, deleteFeedback } from '../../services/feedbackService';

const { Option } = Select;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách feedback khi component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getAllFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      message.error('Không thể tải danh sách phản hồi');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn chỉnh sửa
  const handleEdit = async (id) => {
    try {
      const feedback = await getFeedbackById(id);
      setSelectedFeedback(feedback);
      form.setFieldsValue({
        title: feedback.title,
        content: feedback.content,
        status: feedback.status,
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin phản hồi');
    }
  };

  // Xử lý khi nhấn xóa
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phản hồi này?',
      onOk: async () => {
        try {
          await deleteFeedback(id);
          message.success('Xóa phản hồi thành công');
          fetchFeedbacks();
        } catch (error) {
          message.error('Xóa phản hồi thất bại');
        }
      },
    });
  };

  // Xử lý cập nhật phản hồi
  const handleUpdate = async (values) => {
    try {
      await updateFeedback(selectedFeedback.id, values);
      message.success('Cập nhật phản hồi thành công');
      setIsModalVisible(false);
      fetchFeedbacks();
    } catch (error) {
      message.error('Cập nhật phản hồi thất bại');
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text) => <span>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</span>,
    },
    {
      title: 'Người gửi',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý phản hồi</h1>
      <Table
        columns={columns}
        dataSource={feedbacks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chỉnh sửa phản hồi"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="PENDING">PENDING</Option>
              <Option value="PROCESSED">PROCESSED</Option>
              <Option value="RESOLVED">RESOLVED</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button style={{ marginLeft: '10px' }} onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;