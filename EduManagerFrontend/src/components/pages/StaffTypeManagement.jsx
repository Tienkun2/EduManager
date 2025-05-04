import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import { getAllStaffTypes, createStaffType, updateStaffType, deleteStaffType } from '../../services/staffTypeService';
import debounce from 'lodash/debounce';

const StaffTypeManagement = () => {
  const [form] = Form.useForm();
  const [staffTypes, setStaffTypes] = useState([]);
  const [filteredStaffTypes, setFilteredStaffTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaffType, setEditingStaffType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  useEffect(() => {
    applySearchAndPagination();
  }, [searchText, staffTypes, pagination.current, pagination.pageSize]);

  const fetchStaffTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllStaffTypes();
      console.log('API response (staff types):', data);
      setStaffTypes(data || []);
      setPagination((prev) => ({ ...prev, total: data.length }));
    } catch (error) {
      message.error('Không thể tải danh sách loại nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const applySearchAndPagination = () => {
    let filtered = [...staffTypes];

    if (searchText) {
      filtered = filtered.filter(
        (staffType) =>
          staffType.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          staffType.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log('Search text:', searchText);
    console.log('Filtered staff types:', filtered);

    setPagination((prev) => ({ ...prev, total: filtered.length }));
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setFilteredStaffTypes(filtered.slice(start, end));
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, 300);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleCreate = () => {
    setEditingStaffType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = async (record) => {
    try {
      const staffTypes = await getAllStaffTypes();
      const staffType = staffTypes.find((st) => st.id === record.id);
      if (!staffType) {
        throw new Error('Loại nhân viên không tìm thấy');
      }
      console.log('Editing staff type:', staffType);
      setEditingStaffType(staffType);
      form.setFieldsValue({
        name: staffType.name,
        description: staffType.description,
        role: staffType.roles?.map((role) => role.name) || [],
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin loại nhân viên');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingStaffType) {
        await updateStaffType(editingStaffType.id, { ...values, role: values.role || [] });
        message.success('Cập nhật loại nhân viên thành công');
      } else {
        await createStaffType({ ...values, role: values.role || [] });
        message.success('Tạo loại nhân viên thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchStaffTypes();
    } catch (error) {
      message.error('Lưu loại nhân viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteStaffType(id);
      message.success('Xóa loại nhân viên thành công');
      fetchStaffTypes();
    } catch (error) {
      message.error('Xóa loại nhân viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles?.map((role) => role.name).join(', ') || '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa loại nhân viên này?"
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

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm kiếm loại nhân viên..."
          style={{ width: 300 }}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={handleCreate}>
          Tạo loại nhân viên mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredStaffTypes}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
      />

      <Modal
        title={editingStaffType ? 'Sửa loại nhân viên' : 'Tạo loại nhân viên'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingStaffType ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
        okButtonProps={{ loading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên loại nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại nhân viên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Select mode="multiple" allowClear placeholder="Chọn vai trò">
              <Select.Option value="USER">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffTypeManagement;