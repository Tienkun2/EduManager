import React, { useState, useEffect } from 'react';
import {
  Layout, Table, Button, Modal, Input, Alert, Space, Tag, Typography,
  Divider, Card, Select, Row, Col, DatePicker
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  SearchOutlined, StopOutlined
} from '@ant-design/icons';
import * as LeaveRequestService from '../../services/leaveRequestService';
import { isAuthenticated, getToken, logout } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminLeaveRequestManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [comments, setComments] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
    searchValue: '',
    leaveType: 'all',
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (isAuthenticated('ADMIN')) {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name || 'Quản trị viên',
            role: decoded.scope.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER',
          };
          if (user.role !== 'ADMIN') {
            setError('Quyền truy cập bị từ chối. Yêu cầu quyền quản trị viên.');
            logout();
            window.location.href = '/admin/login';
            return;
          }
          setCurrentUser(user);
        } catch (e) {
          console.error('Lỗi khi phân tích token:', e);
          setError('Lỗi khi tải dữ liệu người dùng.');
          logout();
          window.location.href = '/admin/login';
        }
      } else {
        setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
        logout();
        window.location.href = '/admin/login';
      }
    } else {
      setError('Quyền truy cập bị từ chối. Yêu cầu quyền quản trị viên.');
      window.location.href = '/admin/login';
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === 'ADMIN') {
      fetchLeaveRequests();
    }
  }, [currentUser, pagination.currentPage, pagination.pageSize, filters]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiPage = pagination.currentPage - 1;
      const pageSize = pagination.pageSize;

      const filterParams = {
        startDate: filters.dateRange && filters.dateRange[0] ? filters.dateRange[0].format('YYYY-MM-DD') : null,
        endDate: filters.dateRange && filters.dateRange[1] ? filters.dateRange[1].format('YYYY-MM-DD') : null,
        searchKeyword: filters.searchValue || null,
        leaveType: filters.leaveType !== 'all' ? filters.leaveType : null,
        status: filters.status !== 'all' ? filters.status : null,
      };

      const response = await LeaveRequestService.getAllLeaveRequests(apiPage, pageSize, filterParams);

      setLeaveRequests(response.content || []);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements || 0,
        pageSize: response.pageable?.pageSize || pageSize,
      }));
    } catch (err) {
      setError('Không thể tải danh sách đơn xin nghỉ phép. Vui lòng thử lại.');
      console.error('Lỗi khi tải đơn xin nghỉ phép:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handlePageSizeChange = (current, size) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      pageSize: size,
    }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, searchValue: e.target.value }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters((prev) => ({ ...prev, dateRange: dates }));
  };

  const handleLeaveTypeChange = (value) => {
    setFilters((prev) => ({ ...prev, leaveType: value }));
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const openViewModal = (request) => {
    setSelectedRequest(request);
    setComments('');
    setNewStatus(request.status);
    setShowModal(true);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await LeaveRequestService.updateLeaveRequest(selectedRequest.id, currentUser.id, {
        status: 'APPROVED',
        approvalComments: comments,
      });
      setSuccess('Đã phê duyệt đơn xin nghỉ phép thành công!');
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      const errorMessage = err.response?.status === 405
        ? 'Phương thức API không được hỗ trợ. Vui lòng kiểm tra cấu hình backend.'
        : err.response?.data?.message || 'Không thể phê duyệt đơn xin nghỉ phép.';
      setError(errorMessage);
      console.error('Error approving leave request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await LeaveRequestService.updateLeaveRequest(selectedRequest.id, currentUser.id, {
        status: 'REJECTED',
        approvalComments: comments,
      });
      setSuccess('Đã từ chối đơn xin nghỉ phép thành công!');
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      const errorMessage = err.response?.status === 405
        ? 'Phương thức API không được hỗ trợ. Vui lòng kiểm tra cấu hình backend.'
        : err.response?.data?.message || 'Không thể từ chối đơn xin nghỉ phép.';
      setError(errorMessage);
      console.error('Error rejecting leave request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === selectedRequest.status) {
      setShowModal(false);
      return;
    }

    setLoading(true);
    try {
      await LeaveRequestService.updateLeaveRequest(selectedRequest.id, currentUser.id, {
        status: newStatus,
        approvalComments: comments || '',
      });
      setSuccess(`Đã cập nhật trạng thái đơn xin nghỉ phép thành ${newStatus} thành công!`);
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      const errorMessage = err.response?.status === 405
        ? 'Phương thức API không được hỗ trợ. Vui lòng kiểm tra cấu hình backend.'
        : err.response?.data?.message || 'Không thể cập nhật trạng thái đơn xin nghỉ phép.';
      setError(errorMessage);
      console.error('Error updating leave request status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn xin nghỉ phép này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await LeaveRequestService.deleteLeaveRequest(selectedRequest.id, currentUser.id);
          setSuccess('Đã xóa đơn xin nghỉ phép thành công!');
          setShowModal(false);
          fetchLeaveRequests();
        } catch (err) {
          setError(err.response?.data?.message || 'Không thể xóa đơn xin nghỉ phép. Vui lòng thử lại.');
          console.error('Error deleting leave request:', err);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusTag = (status) => {
    let color, statusText, icon;
    switch (status) {
      case 'APPROVED':
        color = 'success';
        statusText = 'Đã phê duyệt';
        icon = <CheckCircleOutlined />;
        break;
      case 'REJECTED':
        color = 'error';
        statusText = 'Đã từ chối';
        icon = <CloseCircleOutlined />;
        break;
      case 'PENDING':
        color = 'warning';
        statusText = 'Đang chờ';
        icon = <ClockCircleOutlined />;
        break;
      case 'CANCELLLED':
        color = 'default';
        statusText = 'Đã hủy';
        icon = <StopOutlined />;
        break;
      default:
        color = 'processing';
        statusText = status;
    }
    return <Tag icon={icon} color={color}>{statusText}</Tag>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => text || 'Không có',
      sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
    },
    {
      title: 'Loại nghỉ',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (text) => {
        const leaveTypeMap = {
          ANNUAL: 'Nghỉ phép năm',
          SICK: 'Nghỉ ốm',
          MATERNITY: 'Nghỉ thai sản',
          UNPAID: 'Nghỉ không lương',
          PERSONAL: 'Nghỉ cá nhân',
        };
        return leaveTypeMap[text] || text;
      },
      filters: [
        { text: 'Nghỉ phép năm', value: 'ANNUAL' },
        { text: 'Nghỉ ốm', value: 'SICK' },
        { text: 'Nghỉ thai sản', value: 'MATERNITY' },
        { text: 'Nghỉ không lương', value: 'UNPAID' },
        { text: 'Nghỉ cá nhân', value: 'PERSONAL' },
      ],
      onFilter: (value, record) => record.leaveType === value,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: 'Tổng số ngày',
      dataIndex: 'totalDays',
      key: 'totalDays',
      render: (totalDays) => totalDays.toFixed(1),
      sorter: (a, b) => a.totalDays - b.totalDays,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Đang chờ', value: 'PENDING' },
        { text: 'Đã phê duyệt', value: 'APPROVED' },
        { text: 'Đã từ chối', value: 'REJECTED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => openViewModal(record)}>
            Quản lý
          </Button>
        </Space>
      ),
    },
  ];

  const renderViewDetails = () => {
    if (!selectedRequest) return null;

    const leaveTypeMap = {
      ANNUAL: 'Nghỉ phép năm',
      SICK: 'Nghỉ ốm',
      MATERNITY: 'Nghỉ thai sản',
      UNPAID: 'Nghỉ không lương',
      PERSONAL: 'Nghỉ cá nhân',
    };

    return (
      <div>
        <Divider orientation="left">Chi tiết đơn xin nghỉ phép</Divider>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title="Thông tin cơ bản">
              <p><Text strong>Loại nghỉ:</Text> {leaveTypeMap[selectedRequest.leaveType] || selectedRequest.leaveType}</p>
              <p><Text strong>Trạng thái:</Text> {getStatusTag(selectedRequest.status)}</p>
              <p><Text strong>Người yêu cầu:</Text> {selectedRequest.userName || 'Không có'}</p>
              <p><Text strong>Ngày tạo:</Text> {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Thông tin thời gian">
              <p><Text strong>Ngày bắt đầu:</Text> {new Date(selectedRequest.startDate).toLocaleDateString('vi-VN')}</p>
              <p><Text strong>Ngày kết thúc:</Text> {new Date(selectedRequest.endDate).toLocaleDateString('vi-VN')}</p>
              <p><Text strong>Tổng số ngày:</Text> {selectedRequest.totalDays.toFixed(1)}</p>
            </Card>
          </Col>
        </Row>

        <Card size="small" title="Lý do xin nghỉ" style={{ marginTop: '16px' }}>
          <p>{selectedRequest.reason || 'Không có lý do được cung cấp'}</p>
        </Card>

        {(selectedRequest.approverName || selectedRequest.approvalComments) && (
          <Card size="small" title="Thông tin phê duyệt" style={{ marginTop: '16px' }}>
            {selectedRequest.approverName && <p><Text strong>Người phê duyệt:</Text> {selectedRequest.approverName}</p>}
            {selectedRequest.approvalComments && <p><Text strong>Bình luận phê duyệt:</Text> {selectedRequest.approvalComments}</p>}
          </Card>
        )}

        {selectedRequest.attachmentUrl && (
          <Card size="small" title="Tài liệu đính kèm" style={{ marginTop: '16px' }}>
            <Button type="link" href={selectedRequest.attachmentUrl} target="_blank">
              Xem tệp đính kèm
            </Button>
          </Card>
        )}

        <Divider orientation="left">Hành động quản trị</Divider>

        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Thay đổi trạng thái:</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
            >
              <Option value="PENDING">Đang chờ</Option>
              <Option value="APPROVED">Đã phê duyệt</Option>
              <Option value="REJECTED">Đã từ chối</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Bình luận quản trị:</Text>
            <Input.TextArea
              rows={3}
              placeholder="Thêm bình luận (tùy chọn)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setShowModal(false)}>Đóng</Button>
            <Button danger onClick={handleDelete} icon={<CloseCircleOutlined />}>Xóa đơn</Button>
            {selectedRequest.status === 'PENDING' && (
              <>
                <Button danger onClick={handleReject} icon={<CloseCircleOutlined />}>Từ chối</Button>
                <Button type="primary" onClick={handleApprove} icon={<CheckCircleOutlined />}>Phê duyệt</Button>
              </>
            )}
            <Button type="primary" onClick={handleStatusUpdate}>Cập nhật trạng thái</Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderFilterSection = () => (
    <Card style={{ marginBottom: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={6}>
          <Text strong>Tìm kiếm:</Text>
          <Input
            placeholder="Tìm theo tên, ID..."
            prefix={<SearchOutlined />}
            value={filters.searchValue}
            onChange={handleSearchChange}
            style={{ marginTop: '8px', width: '100%' }}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={10}>
          <Text strong>Khoảng thời gian:</Text>
          <RangePicker
            style={{ marginTop: '8px', width: '100%' }}
            value={filters.dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Text strong>Loại nghỉ phép:</Text>
          <Select
            style={{ marginTop: '8px', width: '100%' }}
            value={filters.leaveType}
            onChange={handleLeaveTypeChange}
          >
            <Option value="all">Tất cả loại</Option>
            <Option value="ANNUAL">Nghỉ phép năm</Option>
            <Option value="SICK">Nghỉ ốm</Option>
            <Option value="MATERNITY">Nghỉ thai sản</Option>
            <Option value="UNPAID">Nghỉ không lương</Option>
            <Option value="PERSONAL">Nghỉ cá nhân</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Text strong>Trạng thái:</Text>
          <Select
            style={{ marginTop: '8px', width: '100%' }}
            value={filters.status}
            onChange={handleStatusChange}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="PENDING">Đang chờ</Option>
            <Option value="APPROVED">Đã phê duyệt</Option>
            <Option value="REJECTED">Đã từ chối</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Card>
          <div style={{ marginBottom: '24px' }}>
            <Title level={2}>Quản lý đơn xin nghỉ phép</Title>
          </div>

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

          {renderFilterSection()}

          <Table
            columns={columns}
            dataSource={leaveRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.currentPage,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} đơn`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            locale={{ emptyText: 'Không tìm thấy đơn xin nghỉ phép.' }}
          />

          <Modal
            title="Quản lý đơn xin nghỉ phép"
            open={showModal}
            onCancel={() => setShowModal(false)}
            footer={null}
            width={800}
            destroyOnClose
          >
            {renderViewDetails()}
          </Modal>
        </Card>
      </div>
    </Content>
  );
};

export default AdminLeaveRequestManagement;