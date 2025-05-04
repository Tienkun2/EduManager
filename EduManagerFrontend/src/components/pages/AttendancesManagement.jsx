import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Select, DatePicker, Popconfirm, message, Card, 
  Space, Typography, Input, Checkbox, Row, Col 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { debounce } from 'lodash';
import { 
  getAllAttendances, 
  getAttendanceById, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance,
  bulkCreateAttendance 
} from '../../services/attendanceService';
import axios from 'axios';

const API_URL = 'http://localhost:8080';
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Debounce function for search input
const debouncedFetch = debounce((fetchFunc) => fetchFunc(), 500);

const AttendanceManagement = () => {
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: null,
    dateRange: null,
  });

  useEffect(() => {
    fetchUsers();
    fetchAttendances();
  }, [pagination.current, pagination.pageSize, filters.search, filters.status, filters.dateRange]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data.result || []);
      console.log('Fetched Users:', response.data.result); // Debug log
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        query: filters.search, // Use 'query' instead of 'search'
        status: filters.status ? filters.status.toUpperCase() : null,
        fromDate: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
        toDate: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
      };
      console.log('Query Params:', JSON.stringify(params, null, 2)); // Detailed debug log
      const response = await getAllAttendances(params);
      const attendanceData = response.result || [];
      setAttendances(attendanceData);
      console.log('Set Attendances:', attendanceData); // Debug log
      setPagination({
        ...pagination,
        total: attendanceData.length,
      });
    } catch (error) {
      message.error('Không thể tải danh sách chấm công');
      console.error('Fetch attendances error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingAttendance(null);
    setIsModalOpen(true);
  };

  const handleBulkCreate = () => {
    bulkForm.resetFields();
    setIsBulkModalOpen(true);
  };

  const handleEdit = async (record) => {
    try {
      const attendance = await getAttendanceById(record.id);
      form.setFieldsValue({
        userId: attendance.userId,
        date: moment(attendance.date),
        status: attendance.status,
        checkInTime: attendance.checkInTime ? moment(attendance.checkInTime, 'HH:mm:ss') : null,
        checkOutTime: attendance.checkOutTime ? moment(attendance.checkOutTime, 'HH:mm:ss') : null,
      });
      setEditingAttendance(attendance);
      setIsModalOpen(true);
    } catch (error) {
      message.error('Không thể tải thông tin chấm công');
      console.error('Edit attendance error:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        checkInTime: values.checkInTime ? values.checkInTime.format('HH:mm:ss') : null,
        checkOutTime: values.checkOutTime ? values.checkOutTime.format('HH:mm:ss') : null,
      };

      if (editingAttendance) {
        await updateAttendance(editingAttendance.id, formattedValues);
        message.success('Cập nhật chấm công thành công');
      } else {
        await createAttendance(formattedValues);
        message.success('Thêm chấm công thành công');
      }

      setIsModalOpen(false);
      fetchAttendances();
    } catch (error) {
      message.error('Lưu chấm công thất bại');
      console.error('Save attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkOk = async () => {
    try {
      const values = await bulkForm.validateFields();
      setLoading(true);

      const bulkData = users.map(user => ({
        userId: user.id,
        date: values.date.format('YYYY-MM-DD'),
        status: values.status[user.id] || 'absent',
        checkInTime: values.checkInTime ? values.checkInTime.format('HH:mm:ss') : null,
        checkOutTime: values.checkOutTime ? values.checkOutTime.format('HH:mm:ss') : null,
      }));

      await bulkCreateAttendance(bulkData);
      message.success('Chấm công hàng loạt thành công');
      setIsBulkModalOpen(false);
      fetchAttendances();
    } catch (error) {
      message.error('Chấm công hàng loạt thất bại');
      console.error('Bulk create attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteAttendance(id);
      message.success('Xóa chấm công thành công');
      fetchAttendances();
    } catch (error) {
      message.error('Xóa chấm công thất bại');
      console.error('Delete attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPagination({
      ...pagination,
      current: 1,
    });
    if (key === 'search') {
      debouncedFetch(fetchAttendances);
    } else {
      fetchAttendances();
    }
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'userFullName',
      key: 'userFullName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const normalizedStatus = status.toLowerCase();
        const color = normalizedStatus === 'present' ? 'green' : 'red';
        return <span style={{ color }}>{normalizedStatus === 'present' ? 'Đi làm' : 'Nghỉ'}</span>;
      },
    },
    {
      title: 'Giờ vào',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (time) => time || 'N/A',
    },
    {
      title: 'Giờ ra',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      render: (time) => time || 'N/A',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bản ghi chấm công này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  console.log('Table DataSource:', attendances.map((att) => ({ ...att, key: att.id }))); // Debug log

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Quản lý chấm công</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm nhân viên"
              prefix={<SearchOutlined />}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              <Option value="present">Đi làm</Option>
              <Option value="absent">Nghỉ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
        </Row>
        <Space style={{ marginBottom: '20px' }}>
          <Button type="primary" onClick={handleCreate}>
            Thêm chấm công
          </Button>
          <Button type="primary" onClick={handleBulkCreate}>
            Chấm công hàng loạt
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={attendances.map((att) => ({ ...att, key: att.id }))}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{ emptyText: 'Không có dữ liệu chấm công' }}
        />

        <Modal
          title={editingAttendance ? 'Sửa chấm công' : 'Thêm chấm công'}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
          okText={editingAttendance ? 'Cập nhật' : 'Thêm'}
          cancelText="Hủy"
          okButtonProps={{ loading }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="userId"
              label="Nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn nhân viên"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Ngày chấm công"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="present">Đi làm</Option>
                <Option value="absent">Nghỉ</Option>
              </Select>
            </Form.Item>
            <Form.Item name="checkInTime" label="Giờ vào">
              <DatePicker.TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="checkOutTime" label="Giờ ra">
              <DatePicker.TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chấm công hàng loạt"
          open={isBulkModalOpen}
          onOk={handleBulkOk}
          onCancel={() => setIsBulkModalOpen(false)}
          okText="Lưu"
          cancelText="Hủy"
          okButtonProps={{ loading }}
          width={800}
        >
          <Form form={bulkForm} layout="vertical">
            <Form.Item
              name="date"
              label="Ngày chấm công"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="checkInTime" label="Giờ vào">
              <DatePicker.TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="checkOutTime" label="Giờ ra">
              <DatePicker.TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Chọn nhân viên đi làm">
              {users.map((user) => (
                <Form.Item
                  key={user.id}
                  name={['status', user.id]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox
                    style={{ marginBottom: '8px', display: 'block' }}
                    onChange={(e) => {
                      bulkForm.setFieldsValue({
                        status: {
                          ...bulkForm.getFieldValue('status'),
                          [user.id]: e.target.checked ? 'present' : 'absent',
                        },
                      });
                    }}
                  >
                    {user.fullName}
                  </Checkbox>
                </Form.Item>
              ))}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AttendanceManagement;