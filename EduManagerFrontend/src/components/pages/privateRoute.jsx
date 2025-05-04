import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated, getToken, logout } from '../../services/authService';

const PrivateRoute = ({ children, requiredRole }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    console.log('PrivateRoute checking auth', { requiredRole });
    const checkAuth = () => {
      const token = getToken();
      if (!token) {
        console.log('No token, setting isAuth to false');
        setIsAuth(false);
        return;
      }
      try {
        const authStatus = isAuthenticated(requiredRole);
        console.log('Auth status:', authStatus);
        setIsAuth(authStatus);
        if (!authStatus) {
          logout(); // Xóa token nếu không xác thực được
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        logout(); // Xóa token nếu có lỗi
        setIsAuth(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return isAuth ? children : <Navigate to="/user/login" replace />;
};

export default PrivateRoute;