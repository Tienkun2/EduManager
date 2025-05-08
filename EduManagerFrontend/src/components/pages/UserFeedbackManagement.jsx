import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Table, Space, Modal, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { createFeedback, getFeedbacksByUser, updateFeedback, deleteFeedback } from '../../services/feedbackService';
import { getToken } from '../../services/authService';

const UserFeedbackManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);

  // Lấy danh sách phản hồi khi component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        message.error('Vui lòng đăng nhập để xem phản hồi');
        return;
      }
      const data = await getFeedbacksByUser();
      setFeedbacks(data);
    } catch (error) {
      message.error('Không thể tải danh sách phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = getToken();
      if (!token) {
        message.error('Vui lòng đăng nhập để gửi phản hồi');
        return;
      }

      const feedbackData = {
        title: values.title,
        content: values.content,
      };
      await createFeedback(feedbackData);
      message.success('Gửi phản hồi thành công');
      form.resetFields();
      fetchFeedbacks(); // Làm mới danh sách
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gửi phản hồi thất bại. Vui lòng thử lại.';
      message.error(errorMessage);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    editForm.setFieldsValue({
      title: feedback.title,
      content: feedback.content,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const feedbackData = {
        title: values.title,
        content: values.content,
      };
      await updateFeedback(editingFeedback.id, feedbackData);
      message.success('Cập nhật phản hồi thành công');
      setIsModalVisible(false);
      fetchFeedbacks(); // Làm mới danh sách
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Cập nhật phản hồi thất bại.';
      message.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      message.success('Xóa phản hồi thành công');
      fetchFeedbacks(); // Làm mới danh sách
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xóa phản hồi thất bại.';
      message.error(errorMessage);
    }
  };

  // Cột của bảng phản hồi
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'PENDING':
            color = 'gold'; // Màu vàng
            text = 'Đang chờ';
            break;
          case 'APPROVED':
            color = 'green'; // Màu xanh lá
            text = 'Đã duyệt';
            break;
          case 'REJECTED':
            color = 'red'; // Màu đỏ
            text = 'Bị từ chối';
            break;
          default:
            color = 'gray';
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status !== 'PENDING'} // Chỉ cho sửa nếu trạng thái là PENDING
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phản hồi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={record.status !== 'PENDING'} // Chỉ cho xóa nếu trạng thái là PENDING
          >
            <Button icon={<DeleteOutlined />} danger disabled={record.status !== 'PENDING'} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gửi phản hồi</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề phản hồi" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea rows={6} placeholder="Nhập nội dung phản hồi" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>

      <h2 style={{ marginTop: '40px' }}>Danh sách phản hồi của bạn</h2>
      <Table
        columns={columns}
        dataSource={feedbacks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Chỉnh sửa phản hồi"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề phản hồi" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung phản hồi" />
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

export default UserFeedbackManagement;