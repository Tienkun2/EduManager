import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Table, Button, Modal, Form, Input, Select, Alert, Space, Typography, Card, Divider, Checkbox, Tag, DatePicker 
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import WorkScheduleService from '../../services/workScheduleService';
import { getAllUsers } from '../../services/userService';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ScheduleManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [filters, setFilters] = useState({ search: '', role: '', department: '', date: null });
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchWorkSchedules();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const uniqueDepartments = [...new Set(users.map(user => user.department).filter(Boolean))];
      const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];
      setDepartments(uniqueDepartments);
      setRoles(uniqueRoles);
    }
  }, [users]);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [filters, allSchedules, pagination.current, pagination.pageSize]);

  const fetchWorkSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await WorkScheduleService.getAllWorkSchedules();
      console.log('API response (schedules):', data);
      const normalizedData = data.map(schedule => ({
        ...schedule,
        userIds: schedule.userid ? [schedule.userid] : schedule.userIds || [],
        startTime: dayjs(schedule.startTime).isValid() ? schedule.startTime : null,
        endTime: dayjs(schedule.endTime).isValid() ? schedule.endTime : null,
      }));
      setAllSchedules(normalizedData);
      setPagination((prev) => ({ ...prev, total: normalizedData.length }));
      applyFiltersAndPagination();
      setError('');
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch làm việc:', error);
      setError('Không thể tải danh sách lịch làm việc. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...allSchedules];

    if (filters.search) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          schedule.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.date) {
      const selectedDate = dayjs(filters.date).startOf('day');
      filtered = filtered.filter((schedule) => {
        const scheduleDate = dayjs(schedule.startTime).startOf('day');
        return scheduleDate.isSame(selectedDate);
      });
    }

    console.log('Filters:', filters);
    console.log('Filtered schedules:', filtered);

    setPagination((prev) => ({ ...prev, total: filtered.length }));
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setSchedules(filtered.slice(start, end));
  };

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, 300);

  const handleDateFilter = (date) => {
    setFilters((prev) => ({ ...prev, date: date ? date.toISOString() : null }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const getFilteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !filters.search || 
        (user.fullName && user.fullName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesDepartment = !filters.department || user.department === filters.department;
      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, filters.search, filters.role, filters.department]);

  const handleAddSchedule = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        userIds: (values.userIds || []).map(id => id.toString()), // Ensure all IDs are strings
      };
      console.log('Payload userIds:', payload.userIds); // Debug here
      if (!payload.userIds || payload.userIds.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một người dùng.');
      }
      await WorkScheduleService.createWorkScheduleForMultipleUsers(payload);
      setSuccessMessage('Tạo lịch làm việc thành công!');
      addForm.resetFields();
      setFilters({ search: '', role: '', department: '', date: null });
      await fetchWorkSchedules();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Lỗi khi tạo lịch làm việc:', error);
      setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo lịch làm việc. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSchedule = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        userIds: values.userIds || [],
      };
      // Optimize: Assume backend supports updating schedule for all userIds in one call
      await WorkScheduleService.updateWorkSchedule(null, selectedSchedule.id, payload);
      setSuccessMessage('Cập nhật lịch làm việc thành công!');
      editForm.resetFields();
      setFilters({ search: '', role: '', department: '', date: null });
      await fetchWorkSchedules();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch làm việc:', error);
      setError('Có lỗi xảy ra khi cập nhật lịch làm việc. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    setIsLoading(true);
    try {
      // Delete schedule for all associated userIds
      await Promise.all(
        selectedSchedule.userIds.map(userId =>
          WorkScheduleService.deleteWorkSchedule(userId, selectedSchedule.id)
        )
      );
      setSuccessMessage('Xóa lịch làm việc thành công!');
      await fetchWorkSchedules();
      setShowViewModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Lỗi khi xóa lịch làm việc:', error);
      setError('Không thể xóa lịch làm việc.');
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowViewModal(true);
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    editForm.setFieldsValue({
      title: schedule.title || '',
      type: schedule.type || '',
      description: schedule.description || '',
      location: schedule.location || '',
      startTime: schedule.startTime ? dayjs(schedule.startTime) : null,
      endTime: schedule.endTime ? dayjs(schedule.endTime) : null,
      userIds: schedule.userIds || [],
    });
    setShowEditModal(true);
  };

  const formatDateTime = (dateTimeString) => {
    return dateTimeString ? dayjs(dateTimeString).format('DD/MM/YYYY HH:mm') : '-';
  };

  const getUserNames = (userIds) => {
    if (!userIds || userIds.length === 0) return 'Không có';
    const userNames = userIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? (user.fullName || user.email) : 'Không xác định';
    });
    return userNames.join(', ');
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location', render: (text) => text || 'Không có' },
    { title: 'Thời gian bắt đầu', dataIndex: 'startTime', key: 'startTime', render: (time) => formatDateTime(time) },
    { title: 'Thời gian kết thúc', dataIndex: 'endTime', key: 'endTime', render: (time) => formatDateTime(time) },
    { title: 'Người làm việc', dataIndex: 'userIds', key: 'userIds', render: (userIds) => getUserNames(userIds) },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => openViewModal(record)} />
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => openViewModal(record)} />
        </Space>
      ),
    },
  ];

  const renderUserSelection = () => {
    return (
      <div>
        <Space style={{ marginBottom: 16, width: '100%' }} wrap>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Tất cả chức vụ"
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value })}
            style={{ width: 150 }}
            allowClear
          >
            {roles.map((role, index) => (
              <Option key={index} value={role}>{role}</Option>
            ))}
          </Select>
          <Select
            placeholder="Tất cả phòng ban"
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value })}
            style={{ width: 150 }}
            allowClear
          >
            {departments.map((dept, index) => (
              <Option key={index} value={dept}>{dept}</Option>
            ))}
          </Select>
          <Button onClick={() => setFilters({ search: '', role: '', department: '', date: null })}>
            Xóa bộ lọc
          </Button>
        </Space>
        <Form.Item
          name="userIds"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một người dùng' }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            {getFilteredUsers.length > 0 ? (
              getFilteredUsers.map(user => (
                <div key={user.id} style={{ marginBottom: 8 }}>
                  <Checkbox value={user.id}>
                    {user.fullName || 'Không có tên'} ({user.email})
                    {user.role && <Tag style={{ marginLeft: 8 }}>{user.role}</Tag>}
                    {user.department && <Tag>{user.department}</Tag>}
                  </Checkbox>
                </div>
              ))
            ) : (
              <Text>Không tìm thấy người dùng phù hợp</Text>
            )}
          </Checkbox.Group>
        </Form.Item>
        <Text>Đã chọn: {editForm.getFieldValue('userIds')?.length || addForm.getFieldValue('userIds')?.length || 0} người</Text>
      </div>
    );
  };

  const renderViewDetails = () => {
    if (!selectedSchedule) return null;
    return (
      <div>
        <Divider orientation="left">Chi tiết lịch làm việc</Divider>
        <p><Text strong>Tiêu đề:</Text> {selectedSchedule.title}</p>
        <p><Text strong>Loại:</Text> {selectedSchedule.type}</p>
        <p><Text strong>Mô tả:</Text> {selectedSchedule.description || 'Không có'}</p>
        <p><Text strong>Địa điểm:</Text> {selectedSchedule.location || 'Không có'}</p>
        <p><Text strong>Thời gian bắt đầu:</Text> {formatDateTime(selectedSchedule.startTime)}</p>
        <p><Text strong>Thời gian kết thúc:</Text> {formatDateTime(selectedSchedule.endTime)}</p>
        <p><Text strong>Người làm việc:</Text> {getUserNames(selectedSchedule.userIds)}</p>
      </div>
    );
  };

  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Quản lý lịch làm việc</Title>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 16 }}
          />
        )}

        {successMessage && (
          <Alert
            message="Thành công"
            description={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => setSuccessMessage('')}
            style={{ marginBottom: 16 }}
          />
        )}

        <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }} wrap>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề hoặc mô tả"
              style={{ width: 300 }}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              value={filters.date ? dayjs(filters.date) : null}
              onChange={handleDateFilter}
              style={{ width: 150 }}
            />
            <Button onClick={() => setFilters({ search: '', role: '', department: '', date: null })}>
              Xóa bộ lọc
            </Button>
          </Space>
          <Button type="primary" onClick={() => { addForm.resetFields(); setShowAddModal(true); }}>
            Thêm lịch làm việc mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={schedules}
          rowKey="id"
          loading={isLoading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{ emptyText: 'Chưa có lịch làm việc nào được tạo.' }}
        />

        <Modal
          title="Thêm lịch làm việc mới"
          open={showAddModal}
          onCancel={() => setShowAddModal(false)}
          footer={null}
          width={720}
        >
          <Form
            form={addForm}
            onFinish={handleAddSchedule}
            layout="vertical"
            initialValues={{ type: '', userIds: [] }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Nhập tiêu đề lịch làm việc" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại công việc"
              rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
            >
              <Select placeholder="-- Chọn loại công việc --">
                <Option value="Giảng dạy">Giảng dạy</Option>
                <Option value="Hội thảo">Hội thảo</Option>
                <Option value="Cuộc họp">Cuộc họp</Option>
                <Option value="Nghiên cứu">Nghiên cứu</Option>
                <Option value="Sự kiện">Sự kiện</Option>
                <Option value="Hành chính">Công tác hành chính</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết" />
            </Form.Item>
            <Form.Item name="location" label="Địa điểm">
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc"
              rules={[
                { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                  },
                }),
              ]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Chọn người tham gia">{renderUserSelection()}</Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowAddModal(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Lưu lịch làm việc
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa lịch làm việc"
          open={showEditModal}
          onCancel={() => setShowEditModal(false)}
          footer={null}
          width={720}
        >
          <Form
            form={editForm}
            onFinish={handleEditSchedule}
            layout="vertical"
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Nhập tiêu đề lịch làm việc" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại công việc"
              rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
            >
              <Select placeholder="-- Chọn loại công việc --">
                <Option value="Giảng dạy">Giảng dạy</Option>
                <Option value="Hội thảo">Hội thảo</Option>
                <Option value="Cuộc họp">Cuộc họp</Option>
                <Option value="Nghiên cứu">Nghiên cứu</Option>
                <Option value="Sự kiện">Sự kiện</Option>
                <Option value="Hành chính">Công tác hành chính</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết" />
            </Form.Item>
            <Form.Item name="location" label="Địa điểm">
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc"
              rules={[
                { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian kết thích phải sau thời gian bắt đầu'));
                  },
                }),
              ]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Chọn người tham gia">{renderUserSelection()}</Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowEditModal(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Cập nhật lịch làm việc
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chi tiết lịch làm việc"
          open={showViewModal}
          onCancel={() => setShowViewModal(false)}
          footer={[
            <Button key="edit" onClick={() => { setShowViewModal(false); openEditModal(selectedSchedule); }}>
              Sửa thông tin
            </Button>,
            <Button key="delete" danger onClick={handleDeleteSchedule} loading={isLoading}>
              Xóa
            </Button>,
            <Button key="close" type="primary" onClick={() => setShowViewModal(false)}>
              Đóng
            </Button>,
          ]}
          width={720}
        >
          {renderViewDetails()}
        </Modal>
      </Card>
    </Content>
  );
};

export default ScheduleManagement;