import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/pages/AdminLogin';
import UserLogin from './components/pages/UserLogin';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import UserManagement from './components/pages/UserManagement';
import ScheduleManagement from './components/pages/ScheduleManagement';
import StaffTypeManagement from './components/pages/StaffTypeManagement';
import DepartmentManagement from './components/pages/DepartmentManagement';
import AdminLeaveRequestManagement from './components/pages/LeaveRequestManagement';
import AttendanceManagement from './components/pages/AttendancesManagement';
import StatisticManagement from './components/pages/StatisticManagement';
import UserDashboard from './components/pages/UserDashboard';
import UserScheduleManagement from './components/pages/UserScheduleManagement';
import UserLeaveRequestManagement from './components/pages/UserLeaveRequestManagement';
import PrivateRoute from './components/pages/privateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Không cần PrivateRoute */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/login" replace />}
        /> {/* Chuyển hướng từ /admin đến /admin/login */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminLayout>
                <Routes>
                  <Route path="users" element={<UserManagement />} />
                  <Route path="staff-types" element={<StaffTypeManagement />} />
                  <Route path="departments" element={<DepartmentManagement />} />
                  <Route path="schedules" element={<ScheduleManagement />} />
                  <Route path="leave-requests" element={<AdminLeaveRequestManagement />} />
                  <Route path="attendances" element={<AttendanceManagement />} />
                  <Route path="statistics" element={<StatisticManagement />} />
                  {/* Nếu không khớp các route con, chuyển hướng về /admin/users */}
                  <Route path="*" element={<Navigate to="/admin/users" replace />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* User routes */}
        <Route path="/user/login" element={<UserLogin />} /> {/* Không cần PrivateRoute */}
        <Route
          path="/user/*"
          element={
            <PrivateRoute requiredRole="USER">
              <UserLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="schedules" element={<UserScheduleManagement />} />
                  <Route path="leave-requests" element={<UserLeaveRequestManagement />} />
                </Routes>
              </UserLayout>
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/user/login" replace />} />
        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;