import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, FileOutlined, CalendarOutlined } from '@ant-design/icons';

const StatisticManagement = () => {
  // Sample statistics data
  const stats = {
    totalUsers: 120,
    totalDepartments: 8,
    totalLeaveRequests: 15,
    totalAttendances: 450,
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thống kê Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Statistic
              title="Tổng Nhân sự"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#1a2a6c' }} />}
              valueStyle={{ color: '#1a2a6c', fontWeight: 500 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Statistic
              title="Tổng Phòng ban"
              value={stats.totalDepartments}
              prefix={<FileOutlined style={{ color: '#b21f1f' }} />}
              valueStyle={{ color: '#b21f1f', fontWeight: 500 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Statistic
              title="Đơn nghỉ phép"
              value={stats.totalLeaveRequests}
              prefix={<FileOutlined style={{ color: '#d4380d' }} />}
              valueStyle={{ color: '#d4380d', fontWeight: 500 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Statistic
              title="Bản ghi chấm công"
              value={stats.totalAttendances}
              prefix={<CalendarOutlined style={{ color: '#531dab' }} />}
              valueStyle={{ color: '#531dab', fontWeight: 500 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticManagement;