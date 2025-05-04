import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  getAllDepartments, 
  getDepartmentById, 
  createDepartment,
  updateDepartment,
  deleteDepartment,
  flattenDepartments 
} from '../../services/departmentService';
import debounce from 'lodash/debounce';

const DepartmentManagement = () => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [flatDepartments, setFlatDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    applySearchAndPagination();
  }, [searchText, flatDepartments, pagination.current, pagination.pageSize]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getAllDepartments();
      console.log('API response (departments):', data);
      setDepartments(data);
      const flattened = flattenDepartments(data);
      console.log('Flattened departments:', flattened);
      setFlatDepartments(flattened);
      setPagination((prev) => ({ ...prev, total: flattened.length }));
    } catch (error) {
      message.error('Không thể tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const applySearchAndPagination = () => {
    let filtered = [...flatDepartments];

    if (searchText) {
      filtered = filtered.filter(
        (department) =>
          department.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          department.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log('Search text:', searchText);
    console.log('Filtered departments:', filtered);

    setPagination((prev) => ({ ...prev, total: filtered.length }));
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setFilteredDepartments(
      filtered.map((dep) => ({ ...dep, key: dep.id })).slice(start, end)
    );
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, 300);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const showAddModal = () => {
    form.resetFields();
    setEditingDepartment(null);
    setIsModalVisible(true);
  };

  const showEditModal = async (departmentId) => {
    try {
      const department = await getDepartmentById(departmentId);
      console.log('Editing department:', department);
      form.setFieldsValue({
        name: department.name,
        description: department.description,
        parentName: department.parentName || null,
      });
      setEditingDepartment(department);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin phòng ban');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, values);
        message.success('Cập nhật phòng ban thành công');
      } else {
        await createDepartment(values);
        message.success('Thêm phòng ban thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchDepartments();
    } catch (error) {
      message.error('Lỗi khi lưu phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departmentId) => {
    try {
      setLoading(true);
      await deleteDepartment(departmentId);
      message.success('Xóa phòng ban thành công');
      fetchDepartments();
    } catch (error) {
      message.error('Lỗi khi xóa phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Phòng ban cha',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (text) => text || '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record.id)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa phòng ban này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm kiếm phòng ban..."
          style={{ width: 300 }}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          Thêm phòng ban
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredDepartments}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{ emptyText: 'Không có dữ liệu phòng ban' }}
      />

      <Modal
        title={editingDepartment ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingDepartment ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phòng ban"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="parentName"
            label="Phòng ban cha"
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Chọn phòng ban cha"
            >
              {flatDepartments.map((dep) => (
                <Select.Option key={dep.id} value={dep.name}>
                  {dep.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;