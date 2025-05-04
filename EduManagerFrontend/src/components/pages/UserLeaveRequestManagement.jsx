import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Card, Alert, Space, Typography, Divider, Tag } from 'antd';
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LeaveRequestService from '../../services/leaveRequestService';
import { getToken } from '../../services/authService';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserLeaveRequestManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [form] = Form.useForm();

  const leaveTypeOptions = [
    { value: 'SICK', label: 'Ốm' },
    { value: 'PERSONAL', label: 'Cá nhân' },
    { value: 'UNPAID', label: 'Không lương' },
    { value: 'ANNUAL', label: 'Nghỉ phép năm' },
    { value: 'MATERNITY', label: 'Thai sản' },
    { value: 'OTHER', label: 'Khác' },
  ];

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LeaveRequestService.getMyLeaveRequests();
      const requests = Array.isArray(data) ? data : [];
      console.log('Fetched leave requests:', requests);

      const normalizedData = requests.map(request => ({
        ...request,
        startDate: dayjs(request.startDate).isValid() ? request.startDate : null,
        endDate: dayjs(request.endDate).isValid() ? request.endDate : null,
        approvalDate: request.approvalDate
          ? dayjs(request.approvalDate).isValid()
            ? request.approvalDate
            : null
          : null,
        createdAt: dayjs(request.createdAt).isValid() ? request.createdAt : null,
        updatedAt: dayjs(request.updatedAt).isValid() ? request.updatedAt : null,
      }));
      setLeaveRequests(normalizedData);
      setFilteredRequests(normalizedData);
    } catch (err) {
      setError('Không thể tải danh sách đơn xin nghỉ phép. Vui lòng thử lại.');
      console.error('Error fetching leave requests:', err, 'Response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = () => {
    let filtered = [...leaveRequests];

    // Search by leave type and reason
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(request => {
        const leaveTypeLabel = leaveTypeOptions.find(opt => opt.value === request.leaveType)?.label.toLowerCase() || '';
        const reason = request.reason ? request.reason.toLowerCase() : '';
        return leaveTypeLabel.includes(searchLower) || reason.includes(searchLower);
      });
    }

    // Filter by date range
    if (dateFilter && dateFilter[0] && dateFilter[1]) {
      const startFilter = dayjs(dateFilter[0]).startOf('day');
      const endFilter = dayjs(dateFilter[1]).endOf('day');
      filtered = filtered.filter(request => {
        const startDate = request.startDate ? dayjs(request.startDate) : null;
        const endDate = request.endDate ? dayjs(request.endDate) : null;
        return startDate && endDate && (
          (startDate.isSame(startFilter) || startDate.isAfter(startFilter)) &&
          (endDate.isSame(endFilter) || endDate.isBefore(endFilter))
        );
      });
    }

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchText, dateFilter, leaveRequests]);

  const handleAddLeaveRequest = async (values) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại.');
      }
      const payload = {
        leaveType: values.leaveType,
        reason: values.reason,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
        attachmentUrl: values.attachmentUrl || '',
      };
      console.log('Sending leave request payload:', payload);
      await LeaveRequestService.createLeaveRequest(payload);
      setSuccess('Tạo đơn xin nghỉ phép thành công!');
      setShowAddModal(false);
      form.resetFields();
      fetchLeaveRequests();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo đơn xin nghỉ phép. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Error creating leave request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLeaveRequest = async () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn xin nghỉ phép này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Hủy đơn',
      cancelText: 'Thoát',
      onOk: async () => {
        setLoading(true);
        try {
          const user = getCurrentUser();
          console.log('Current user for cancel:', user, 'User ID:', user?.id);
          if (!user || !user.id) {
            throw new Error('Vui lòng đăng nhập lại.');
          }
          await LeaveRequestService.cancelLeaveRequest(selectedRequest.id, user.id);
          setSuccess('Hủy đơn xin nghỉ phép thành công!');
          setShowViewModal(false);
          fetchLeaveRequests();
          setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Không thể hủy đơn xin nghỉ phép. Vui lòng thử lại.';
          setError(errorMessage);
          console.error('Error canceling leave request:', err);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusTag = (status) => {
    let color;
    let statusText;
    switch (status) {
      case 'APPROVED':
        color = 'success';
        statusText = 'Đã phê duyệt';
        break;
      case 'REJECTED':
        color = 'error';
        statusText = 'Đã từ chối';
        break;
      case 'PENDING':
        color = 'warning';
        statusText = 'Đang chờ';
        break;
      case 'CANCELLED':
        color = 'default';
        statusText = 'Đã hủy';
        break;
      default:
        color = 'processing';
        statusText = status;
    }
    return <Tag color={color}>{statusText}</Tag>;
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    {
      title: 'Loại nghỉ',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (text) => {
        const leaveTypeMap = {
          SICK: 'Ốm',
          PERSONAL: 'Cá nhân',
          UNPAID: 'Không lương',
          ANNUAL: 'Nghỉ phép năm',
          MATERNITY: 'Thai sản',
          OTHER: 'Khác',
        };
        return leaveTypeMap[text] || text;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => (text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => (text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Tổng số ngày',
      dataIndex: 'totalDays',
      key: 'totalDays',
      render: (totalDays) => (totalDays ? totalDays.toFixed(1) : '-'),
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => getStatusTag(status) },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setSelectedRequest(record);
              setShowViewModal(true);
            }}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const renderViewDetails = () => {
    if (!selectedRequest) return null;
    const leaveTypeMap = {
      SICK: 'Ốm',
      PERSONAL: 'Cá nhân',
      UNPAID: 'Không lương',
      ANNUAL: 'Nghỉ phép năm',
      MATERNITY: 'Thai sản',
      OTHER: 'Khác',
    };
    return (
      <div>
        <Divider orientation="left">Chi tiết đơn xin nghỉ phép</Divider>
        <p>
          <Text strong>Loại nghỉ:</Text> {leaveTypeMap[selectedRequest.leaveType] || selectedRequest.leaveType}
        </p>
        <p>
          <Text strong>Trạng thái:</Text> {getStatusTag(selectedRequest.status)}
        </p>
        <p>
          <Text strong>Khoảng thời gian:</Text>{' '}
          {selectedRequest.startDate ? dayjs(selectedRequest.startDate).format('DD/MM/YYYY HH:mm') : '-'} đến{' '}
          {selectedRequest.endDate ? dayjs(selectedRequest.endDate).format('DD/MM/YYYY HH:mm') : '-'}
        </p>
        <p>
          <Text strong>Tổng số ngày:</Text> {selectedRequest.totalDays ? selectedRequest.totalDays.toFixed(1) : '-'}
        </p>
        <p>
          <Text strong>Lý do:</Text> {selectedRequest.reason || 'Không có'}
        </p>
        <p>
          <Text strong>Ngày tạo:</Text>{' '}
          {selectedRequest.createdAt ? dayjs(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
        </p>
        {selectedRequest.approvedByName && (
          <p>
            <Text strong>Người phê duyệt:</Text> {selectedRequest.approvedByName}
          </p>
        )}
        {selectedRequest.approvalComments && (
          <p>
            <Text strong>Bình luận phê duyệt:</Text> {selectedRequest.approvalComments}
          </p>
        )}
        {selectedRequest.substituteUserName && (
          <p>
            <Text strong>Người thay thế:</Text> {selectedRequest.substituteUserName}
          </p>
        )}
        {selectedRequest.attachmentUrl && (
          <p>
            <Text strong>Tệp đính kèm:</Text>{' '}
            <a href={selectedRequest.attachmentUrl} target="_blank" rel="noopener noreferrer">
              Xem tệp đính kèm
            </a>
          </p>
        )}
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={() => setShowViewModal(false)}>Đóng</Button>
          {selectedRequest.status === 'PENDING' && (
            <Button danger onClick={handleCancelLeaveRequest}>
              Hủy đơn
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <Title level={2}>Đơn xin nghỉ phép của bạn</Title>
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
      {success && (
        <Alert
          message="Thành công"
          description={success}
          type="success"
          showIcon
          closable
          onClose={() => setSuccess(null)}
          style={{ marginBottom: 16 }}
        />
      )}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo loại nghỉ hoặc lý do"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => setDateFilter(dates)}
            style={{ width: 300 }}
          />
        </Space>
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={() => {
            form.resetFields();
            setShowAddModal(true);
          }}
        >
          Tạo đơn xin nghỉ phép mới
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Không tìm thấy đơn xin nghỉ phép nào.' }}
      />
      <Modal
        title="Tạo đơn xin nghỉ phép mới"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={720}
      >
        <Form form={form} onFinish={handleAddLeaveRequest} layout="vertical">
          <Form.Item
            name="leaveType"
            label="Loại nghỉ"
            rules={[{ required: true, message: 'Vui lòng chọn loại nghỉ!' }]}
          >
            <Select placeholder="-- Chọn loại nghỉ --">
              {leaveTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dates"
            label="Khoảng thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
          >
            <RangePicker
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: 'HH:mm' }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do xin nghỉ" />
          </Form.Item>
          <Form.Item
            name="attachmentUrl"
            label="Tệp đính kèm (URL)"
            rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ!', required: false }]}
          >
            <Input placeholder="Nhập URL tệp đính kèm (nếu có)" />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowAddModal(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Gửi đơn
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết đơn xin nghỉ phép"
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        width={720}
      >
        {renderViewDetails()}
      </Modal>
    </Card>
  );
};

export default UserLeaveRequestManagement;