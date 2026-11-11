import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  if (!isAuthenticated) {
    // Open login modal and redirect to home
    setTimeout(() => openAuthModal('login'), 100);
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toUpperCase();
    if (!allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Truy Cập Bị Từ Chối (403 Forbidden)</h2>
          <p className="text-slate-600 max-w-md mb-6 text-sm">
            Tài khoản của bạn ({user?.role}) không có quyền truy cập vào chức năng này. Vui lòng liên hệ quản trị viên hoặc đăng nhập bằng tài khoản phù hợp.
          </p>
          <a
            href="/"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
          >
            Quay Lại Trang Chủ
          </a>
        </div>
      );
    }
  }

  return children;
};

