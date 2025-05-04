import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Typography, Input, DatePicker, Space, Button, Modal, Form, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import WorkScheduleService from '../../services/workScheduleService';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const UserScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSchedules();
    fetchUsers(); // Lấy danh sách người dùng
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, dateRange, schedules]);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WorkScheduleService.getUserWorkSchedulesByUser();
      const normalizedData = data.map((schedule) => ({
        ...schedule,
        startTime: dayjs(schedule.startTime).isValid() ? schedule.startTime : null,
        endTime: dayjs(schedule.endTime).isValid() ? schedule.endTime : null,
      }));
      setSchedules(normalizedData);
      setFilteredSchedules(normalizedData);
    } catch (err) {
      setError('Không thể tải lịch làm việc. Vui lòng thử lại.');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await WorkScheduleService.getUsers(); // Giả sử có API lấy danh sách người dùng
      setUsers(data);
    } catch (err) {
      message.error('Không thể tải danh sách người dùng.');
      console.error('Error fetching users:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...schedules];
    if (searchText) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          schedule.type?.toLowerCase().includes(searchText.toLowerCase()) ||
          schedule.location?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(
        (schedule) =>
          schedule.startTime &&
          schedule.endTime &&
          (dayjs(schedule.startTime).isBetween(start, end, 'day', '[]') ||
           dayjs(schedule.endTime).isBetween(start, end, 'day', '[]') ||
           (dayjs(schedule.startTime).isSameOrBefore(start, 'day') && dayjs(schedule.endTime).isSameOrAfter(end, 'day')))
      );
    }
    setFilteredSchedules(filtered);
  };

  const formatDateTime = (dateTimeString) => {
    return dateTimeString ? dayjs(dateTimeString).format('DD/MM/YYYY HH:mm') : '-';
  };

  const handleAddSchedules = async (values) => {
    try {
      setLoading(true);
      const { users, title, type, location, timeRange } = values;
      const [startTime, endTime] = timeRange;

      // Chuẩn bị dữ liệu lịch cho từng người dùng
      const schedulesData = users.map((userId) => ({
        userId,
        title,
        type,
        location,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }));

      // Gửi yêu cầu thêm lịch hàng loạt
      await WorkScheduleService.createBulkSchedules(schedulesData);
      message.success('Thêm lịch giảng dạy thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchSchedules(); // Làm mới danh sách lịch
    } catch (err) {
      message.error('Không thể thêm lịch giảng dạy. Vui lòng thử lại.');
      console.error('Error adding schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location', render: (text) => text || 'Không có' },
    { title: 'Thời gian bắt đầu', dataIndex: 'startTime', key: 'startTime', render: (time) => formatDateTime(time) },
    { title: 'Thời gian kết thúc', dataIndex: 'endTime', key: 'endTime', render: (time) => formatDateTime(time) },
  ];

  return (
    <Card>
      <Title level={2}>Lịch làm việc của bạn</Title>
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
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tiêu đề, loại hoặc địa điểm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => setDateRange(dates || [])}
            style={{ width: 300 }}
          />
        </Space>
        <Space>
          <Button
            type="primary"
            onClick={fetchSchedules}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            Thêm lịch giảng dạy
          </Button>
        </Space>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredSchedules}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: 'Bạn chưa có lịch làm việc nào.',
        }}
      />

      {/* Modal thêm lịch giảng dạy */}
      <Modal
        title="Thêm lịch giảng dạy"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSchedules}
        >
          <Form.Item
            name="users"
            label="Chọn giáo viên/nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một người!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn người dùng"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.ma_nhan_vien || user.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề lịch" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng nhập loại lịch!' }]}
          >
            <Input placeholder="Nhập loại lịch (VD: Giảng dạy, Họp)" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Địa điểm"
          >
            <Input placeholder="Nhập địa điểm (tùy chọn)" />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm lịch
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserScheduleManagement;