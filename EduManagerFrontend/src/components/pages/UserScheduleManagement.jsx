import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Typography, Input, DatePicker, Space, Button, Tag, Dropdown, Menu, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import WorkScheduleService from '../../services/workScheduleService';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const UserScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WorkScheduleService.getUserWorkSchedulesByUser();
      const normalizedData = data.map((schedule) => {
        const startTime = schedule.startTime ? dayjs(schedule.startTime) : null;
        const endTime = schedule.endTime ? dayjs(schedule.endTime) : null;
        if (startTime && !startTime.isValid()) {
          console.warn(`Invalid startTime for schedule ID ${schedule.id}: ${schedule.startTime}`);
        }
        if (endTime && !endTime.isValid()) {
          console.warn(`Invalid endTime for schedule ID ${schedule.id}: ${schedule.endTime}`);
        }
        return {
          ...schedule,
          startTime: startTime && startTime.isValid() ? startTime : null,
          endTime: endTime && endTime.isValid() ? endTime : null,
        };
      });
      setSchedules(normalizedData);
      setFilteredSchedules(normalizedData);
    } catch (err) {
      setError('Không thể tải lịch làm việc. Vui lòng thử lại.');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, scheduleId, status) => {
    setLoading(true);
    try {
      await WorkScheduleService.updateWorkScheduleStatus(userId, scheduleId, status);
      message.success('Cập nhật trạng thái thành công');
      await fetchSchedules(); // Refresh the schedule list
    } catch (err) {
      message.error('Cập nhật trạng thái thất bại');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...schedules];

    // Apply text search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (schedule) =>
          schedule.title?.toLowerCase().includes(searchLower) ||
          schedule.type?.toLowerCase().includes(searchLower) ||
          schedule.location?.toLowerCase().includes(searchLower) ||
          schedule.status?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (dateFilter && dateFilter[0] && dateFilter[1]) {
      const startFilter = dayjs(dateFilter[0]).startOf('day');
      const endFilter = dayjs(dateFilter[1]).endOf('day');
      filtered = filtered.filter((schedule) => {
        const startTime = schedule.startTime ? dayjs(schedule.startTime) : null;
        const endTime = schedule.endTime ? dayjs(schedule.endTime) : null;
        return (
          startTime &&
          endTime &&
          startTime.isValid() &&
          endTime.isValid() &&
          (startTime.isSame(startFilter) || startTime.isAfter(startFilter)) &&
          (endTime.isSame(endFilter) || endTime.isBefore(endFilter))
        );
      });
    }

    setFilteredSchedules(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, dateFilter, schedules]);

  const formatDateTime = (dateTime) => {
    return dateTime && dayjs(dateTime).isValid() ? dayjs(dateTime).format('DD/MM/YYYY HH:mm') : '-';
  };

  const formatStatus = (status) => {
    const statusMap = {
      PENDING: { text: 'Chưa thực hiện', color: 'default' },
      IN_PROGRESS: { text: 'Đang thực hiện', color: 'blue' },
      COMPLETED: { text: 'Đã hoàn thành', color: 'green' },
      CANCELLED: { text: 'Đã hủy', color: 'red' },
    };
    const { text, color } = statusMap[status] || { text: status || '-', color: 'default' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location', render: (text) => text || 'Không có' },
    { title: 'Thời gian bắt đầu', dataIndex: 'startTime', key: 'startTime', render: (time) => formatDateTime(time) },
    { title: 'Thời gian kết thúc', dataIndex: 'endTime', key: 'endTime', render: (time) => formatDateTime(time) },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => formatStatus(status) },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => handleStatusChange(record.userid, record.id, key)}
              items={[
                { key: 'PENDING', label: 'Chưa thực hiện' },
                { key: 'IN_PROGRESS', label: 'Đang thực hiện' },
                { key: 'COMPLETED', label: 'Đã hoàn thành' },
                { key: 'CANCELLED', label: 'Đã hủy' },
              ]}
            />
          }
        >
          <Button>Thay đổi trạng thái</Button>
        </Dropdown>
      ),
    },
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
            placeholder="Tìm kiếm theo tiêu đề, loại, địa điểm hoặc trạng thái"
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
        <Space>
          <Button type="primary" onClick={fetchSchedules} loading={loading}>
            Làm mới
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
    </Card>
  );
};

export default UserScheduleManagement;