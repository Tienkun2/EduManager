import React, { useState, useEffect } from 'react';
import { 
  Layout, Table, Button, Modal, Form, Input, Select, Alert, Space, Typography, Card, Divider, Tag 
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { getAllDepartments, flattenDepartments } from '../../services/departmentService';
import { getAllStaffTypes } from '../../services/staffTypeService';
import debounce from 'lodash/debounce';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffTypes, setStaffTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [filters, setFilters] = useState({ search: '', departmentId: null, staffTypeId: null });
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchStaffTypes();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      applyFilters();
    }
  }, [filters, allUsers, pagination.current, pagination.pageSize]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      console.log('Fetched users:', data);
      
      if (data && data.length > 0) {
        setAllUsers(data);
        setPagination((prev) => ({ ...prev, total: data.length }));
      } else {
        setAllUsers([]);
        setUsers([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải danh sách người dùng');
      console.error(err);
      setAllUsers([]);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getAllDepartments();
      const flattenedDepts = flattenDepartments(data);
      console.log('Fetched departments:', flattenedDepts);
      setDepartments(flattenedDepts);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng ban:', err);
    }
  };

  const fetchStaffTypes = async () => {
    try {
      const data = await getAllStaffTypes();
      console.log('Fetched staff types:', data);
      setStaffTypes(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách loại nhân viên:', err);
    }
  };

  const applyFilters = () => {
    if (!allUsers || allUsers.length === 0) {
      setUsers([]);
      return;
    }
  
    let filtered = [...allUsers];
  
    if (filters.search) {
      filtered = filtered.filter(user =>
        (user.fullName?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(filters.search.toLowerCase())
      );
    }
  
    if (filters.departmentId) {
      const selectedDept = departments.find(dept => dept.id === filters.departmentId);
      if (selectedDept) {
        const deptName = selectedDept.name || selectedDept.label;
        filtered = filtered.filter(user => user.departmentName === deptName);
      }
    }
  
    if (filters.staffTypeId) {
      const selectedType = staffTypes.find(type => type.id === filters.staffTypeId);
      if (selectedType) {
        filtered = filtered.filter(user => user.staffTypeName === selectedType.name);
      }
    }
  
    setPagination((prev) => ({ ...prev, total: filtered.length }));
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setUsers(filtered.slice(start, end));
  };
  
  const handleDepartmentFilter = (value) => {
    setFilters((prev) => ({ ...prev, departmentId: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, 300);
  
  const handleStaffTypeFilter = (value) => {
    setFilters((prev) => ({ ...prev, staffTypeId: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAddUser = async (values) => {
    setIsLoading(true);
    try {
      const payload = { ...values, role: [values.role] };
      console.log('Payload sent to createUser:', payload);
      await createUser(payload);
      setSuccess('Thêm người dùng thành công');
      addForm.resetFields();
      await fetchUsers();
      setShowAddUserModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Lỗi khi thêm người dùng mới: ' + (err.response?.data?.message || err.message));
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (values) => {
    setIsLoading(true);
    try {
      const userId = selectedUser.id;
      const userData = { ...values, role: [values.role] };
      await updateUser(userId, userData);
      setSuccess('Cập nhật người dùng thành công');
      editForm.resetFields();
      await fetchUsers();
      setShowEditUserModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Lỗi khi cập nhật người dùng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await deleteUser(selectedUser.id);
      setSuccess('Xóa người dùng thành công');
      await fetchUsers();
      setShowDeleteConfirmation(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Lỗi khi xóa người dùng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      id: user.id,
      email: user.email || '',
      password: '',
      role: user.roles?.map(role => role.name)[0] || 'USER',
      staffCode: user.staffCode || '',
      fullName: user.fullName || '',
      gender: user.gender || 'Nam',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      identityCard: user.identityCard || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      status: user.status || 'Đang hoạt động',
      departmentId: user.departmentId || '',
      staffTypeId: user.staffTypeId || ''
    });
    setShowEditUserModal(true);
  };

  const openDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmation(true);
  };

  const formatRoles = (roles) => {
    if (!roles || !Array.isArray(roles)) return 'N/A';
    return roles.map(role => role.name).join(', ');
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case 'Đang hoạt động': color = 'success'; break;
      case 'Đã khóa': color = 'warning'; break;
      case 'Đã nghỉ việc': color = 'error'; break;
      default: color = 'default';
    }
    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id', render: (text) => text || '-' },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'roles', key: 'roles', render: (roles) => formatRoles(roles) },
    { title: 'SĐT', dataIndex: 'phoneNumber', key: 'phoneNumber', render: (text) => text || '-' },
    { title: 'Phòng ban', dataIndex: 'departmentName', key: 'departmentName', render: (text) => text || '-' },
    { title: 'Loại NV', dataIndex: 'staffTypeName', key: 'staffTypeName', render: (text) => text || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => getStatusTag(status) },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => openViewModal(record)} />
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => openDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];

  const renderViewDetails = () => {
    if (!selectedUser) return null;
    return (
      <div>
        <Divider orientation="left">Thông tin chi tiết người dùng</Divider>
        <p><Text strong>Mã nhân viên:</Text> {selectedUser.id || '-'}</p>
        <p><Text strong>Họ và tên:</Text> {selectedUser.fullName}</p>
        <p><Text strong>Email:</Text> {selectedUser.email}</p>
        <p><Text strong>Vai trò:</Text> {formatRoles(selectedUser.roles)}</p>
        <p><Text strong>Giới tính:</Text> {selectedUser.gender}</p>
        <p><Text strong>Ngày sinh:</Text> {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</p>
        <p><Text strong>CMND/CCCD:</Text> {selectedUser.identityCard || '-'}</p>
        <p><Text strong>Số điện thoại:</Text> {selectedUser.phoneNumber || '-'}</p>
        <p><Text strong>Địa chỉ:</Text> {selectedUser.address || '-'}</p>
        <p><Text strong>Phòng ban:</Text> {selectedUser.departmentName || '-'}</p>
        <p><Text strong>Loại nhân viên:</Text> {selectedUser.staffTypeName || '-'}</p>
        <p><Text strong>Trạng thái:</Text> {getStatusTag(selectedUser.status)}</p>
      </div>
    );
  };

  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Quản lý nhân sự</Title>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '16px' }}
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
            style={{ marginBottom: '16px' }}
          />
        )}

        <Space style={{ marginBottom: '16px', justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm người dùng..."
              style={{ width: 300 }}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Lọc theo phòng ban"
              style={{ width: 200 }}
              onChange={handleDepartmentFilter}
              allowClear
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.label || dept.name}</Option>
              ))}
            </Select>
            <Select
              placeholder="Lọc theo loại nhân viên"
              style={{ width: 200 }}
              onChange={handleStaffTypeFilter}
              allowClear
            >
              {staffTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Space>
          <Button type="primary" onClick={() => { addForm.resetFields(); setShowAddUserModal(true); }}>
            Thêm người dùng mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{ emptyText: 'Không có dữ liệu người dùng' }}
        />

        <Modal
          title="Thêm người dùng mới"
          open={showAddUserModal}
          onCancel={() => setShowAddUserModal(false)}
          footer={null}
          width={720}
        >
          <Form
            form={addForm}
            onFinish={handleAddUser}
            layout="vertical"
            initialValues={{ role: 'USER', gender: 'Nam', status: 'Đang hoạt động' }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không đúng định dạng!' },
                { max: 100, message: 'Email không được vượt quá 100 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                { max: 50, message: 'Mật khẩu không được vượt quá 50 ký tự!' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, message: 'Mật khẩu phải chứa ít nhất một chữ cái và một số!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
                { max: 50, message: 'Họ và tên không được vượt quá 50 ký tự!' },
                { pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng!' }
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 18) {
                      return Promise.reject('Người dùng phải từ 18 tuổi trở lên!');
                    }
                    if (birthDate > today) {
                      return Promise.reject('Ngày sinh không được trong tương lai!');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="identityCard"
              label="CMND/CCCD"
              rules={[
                { required: true, message: 'Vui lòng nhập CMND/CCCD!' },
                { pattern: /^\d{9,12}$/, message: 'CMND/CCCD phải có 9 hoặc 12 chữ số!' }
              ]}
            >
              <Input placeholder="Nhập CMND/CCCD" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^(0|\+84)[3|5|7|8|9]\d{8}$/, message: 'Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Đang hoạt động">Đang hoạt động</Option>
                <Option value="Đã khóa">Đã khóa</Option>
                <Option value="Đã nghỉ việc">Đã nghỉ việc</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="USER">USER</Option>
                <Option value="ADMIN">ADMIN</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="departmentId"
              label="Phòng ban"
              rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
            >
              <Select placeholder="Chọn phòng ban">
                {departments.map(dept => (
                  <Option key={dept.id} value={dept.id}>{dept.label || dept.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="staffTypeId"
              label="Loại nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn loại nhân viên!' }]}
            >
              <Select placeholder="Chọn loại nhân viên">
                {staffTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowAddUserModal(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Thêm người dùng
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Sửa thông tin người dùng"
          open={showEditUserModal}
          onCancel={() => setShowEditUserModal(false)}
          footer={null}
          width={720}
        >
          <Form
            form={editForm}
            onFinish={handleEditUser}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không đúng định dạng!' },
                { max: 100, message: 'Email không được vượt quá 100 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { min: 8, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                { max: 50, message: 'Mật khẩu không được vượt quá 50 ký tự!' },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Mật khẩu phải chứa ít nhất một chữ cái và một số!',
                  when: (value) => !!value // Chỉ validate nếu người dùng nhập mật khẩu
                }
              ]}
            >
              <Input.Password placeholder="Để trống nếu không thay đổi" />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
                { max: 50, message: 'Họ và tên không được vượt quá 50 ký tự!' },
                { pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng!' }
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 18) {
                      return Promise.reject('Người dùng phải từ 18 tuổi trở lên!');
                    }
                    if (birthDate > today) {
                      return Promise.reject('Ngày sinh không được trong tương lai!');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="identityCard"
              label="CMND/CCCD"
              rules={[
                { required: true, message: 'Vui lòng nhập CMND/CCCD!' },
                { pattern: /^\d{9,12}$/, message: 'CMND/CCCD phải có 9 hoặc 12 chữ số!' }
              ]}
            >
              <Input placeholder="Nhập CMND/CCCD" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^(0|\+84)[3|5|7|8|9]\d{8}$/, message: 'Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Đang hoạt động">Đang hoạt động</Option>
                <Option value="Đã khóa">Đã khóa</Option>
                <Option value="Đã nghỉ việc">Đã nghỉ việc</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="USER">USER</Option>
                <Option value="ADMIN">ADMIN</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="departmentId"
              label="Phòng ban"
              rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
            >
              <Select placeholder="Chọn phòng ban">
                {departments.map(dept => (
                  <Option key={dept.id} value={dept.id}>{dept.label || dept.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="staffTypeId"
              label="Loại nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn loại nhân viên!' }]}
            >
              <Select placeholder="Chọn loại nhân viên">
                {staffTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowEditUserModal(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Cập nhật người dùng
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Thông tin chi tiết người dùng"
          open={showViewUserModal}
          onCancel={() => setShowViewUserModal(false)}
          footer={[
            <Button key="edit" onClick={() => { setShowViewUserModal(false); openEditModal(selectedUser); }}>
              Sửa thông tin
            </Button>,
            <Button key="close" type="primary" onClick={() => setShowViewUserModal(false)}>
              Đóng
            </Button>,
          ]}
          width={720}
        >
          {renderViewDetails()}
        </Modal>

        <Modal
          title="Xác nhận xóa"
          open={showDeleteConfirmation}
          onCancel={() => setShowDeleteConfirmation(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowDeleteConfirmation(false)}>
              Hủy
            </Button>,
            <Button key="delete" type="primary" danger onClick={handleDeleteUser} loading={isLoading}>
              Xóa
            </Button>,
          ]}
        >
          <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.fullName}</strong>?</p>
          <p style={{ color: 'red' }}>Hành động này không thể hoàn tác!</p>
        </Modal>
      </Card>
    </Content>
  );
};

export default UserManagement;