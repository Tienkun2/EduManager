import React, { useRef, useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button } from 'antd';
import { UserOutlined, FileOutlined, BarChartOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAllUsers } from '../../services/userService'; // Assuming getAllUsers is in apiService.js

const StatisticManagement = () => {
  // State for statistics, initialized with default values
  const [stats, setStats] = useState({
    totalStaff: 0, // Will be updated after fetching users
    performanceScore: 85,
    trendAnalysis: 10,
    taskCompletion: 95,
  });

  // Sample data for charts
  const performanceTrendData = [
    { month: 'Tháng 1', score: 80 },
    { month: 'Tháng 2', score: 82 },
    { month: 'Tháng 3', score: 85 },
    { month: 'Tháng 4', score: 83 },
    { month: 'Tháng 5', score: 85 },
  ];

  const taskCompletionData = [
    { month: 'Tháng 1', completion: 90 },
    { month: 'Tháng 2', completion: 92 },
    { month: 'Tháng 3', completion: 95 },
    { month: 'Tháng 4', completion: 93 },
    { month: 'Tháng 5', completion: 95 },
  ];

  // Fetch total staff count on component mount
  useEffect(() => {
    const fetchTotalStaff = async () => {
      try {
        const users = await getAllUsers();
        setStats(prevStats => ({
          ...prevStats,
          totalStaff: users.length, // Update totalStaff with the number of users
        }));
      } catch (error) {
        console.error('Failed to fetch total staff:', error);
      }
    };

    fetchTotalStaff();
  }, []);

  // References to chart containers for capturing
  const performanceChartRef = useRef(null);
  const taskChartRef = useRef(null);

  // Function to generate and download PDF report
  const exportReport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const maxWidth = pageWidth - 2 * margin;

    // Load and register custom font (DejaVu Sans)
    const fontPath = `${window.location.origin}/fonts/DejaVuSans.ttf`;
    const font = await fetch(fontPath).then(res => res.arrayBuffer());
    pdf.addFileToVFS('DejaVuSans.ttf', font);
    pdf.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    pdf.setFont('DejaVuSans');

    // Add title
    pdf.setFontSize(18);
    pdf.text('Báo cáo Hiệu suất Nhân sự', margin, 20);

    // Add timestamp
    pdf.setFontSize(12);
    const date = new Date().toLocaleString('vi-VN');
    pdf.text(`Ngày xuất báo cáo: ${date}`, margin, 30);

    // Add statistics
    pdf.setFontSize(14);
    pdf.text('Tóm tắt Thống kê:', margin, 45);
    pdf.setFontSize(12);
    pdf.text(`Tổng Cán bộ, Giảng viên, Nhân viên: ${stats.totalStaff}`, margin, 55);
    pdf.text(`Điểm Hiệu suất Công tác: ${stats.performanceScore}/100`, margin, 65);
    pdf.text(`Xu hướng so với Kỳ trước: ${stats.trendAnalysis}%`, margin, 75);
    pdf.text(`Tỷ lệ Hoàn thành Nhiệm vụ: ${stats.taskCompletion}%`, margin, 85);

    // Capture and add performance chart
    let yOffset = 100;
    if (performanceChartRef.current) {
      const canvas = await html2canvas(performanceChartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * maxWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', margin, yOffset, maxWidth, imgHeight);
      yOffset += imgHeight + 10;
    }

    // Add new page if necessary and add task completion chart
    if (yOffset > 250) pdf.addPage();
    if (taskChartRef.current) {
      const canvas = await html2canvas(taskChartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * maxWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', margin, yOffset, maxWidth, imgHeight);
    }

    // Save the PDF
    const filename = `BaoCaoHieuSuat_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Thống kê Hiệu suất Nhân sự</h2>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportReport}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Xuất Báo cáo
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <Statistic
              title="Tổng Cán bộ, Giảng viên, Nhân viên"
              value={stats.totalStaff}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1a2a6c', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <Statistic
              title="Điểm Hiệu suất Công tác"
              value={stats.performanceScore}
              suffix="/100"
              prefix={<BarChartOutlined className="text-red-600" />}
              valueStyle={{ color: '#b21f1f', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <Statistic
              title="Xu hướng so với Kỳ trước"
              value={stats.trendAnalysis}
              suffix="%"
              prefix={<FileOutlined className="text-orange-600" />}
              valueStyle={{ color: '#d4380d', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <Statistic
              title="Tỷ lệ Hoàn thành Nhiệm vụ"
              value={stats.taskCompletion}
              suffix="%"
              prefix={<ClockCircleOutlined className="text-purple-600" />}
              valueStyle={{ color: '#531dab', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card
            title="Xu hướng Điểm Hiệu suất"
            className="bg-white rounded-lg shadow-md"
          >
            <div ref={performanceChartRef}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#1a2a6c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Tỷ lệ Hoàn thành Nhiệm vụ"
            className="bg-white rounded-lg shadow-md"
          >
            <div ref={taskChartRef}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completion" fill="#531dab" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticManagement;