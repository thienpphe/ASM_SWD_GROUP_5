import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  User,
  LogOut,
  Key,
  Settings,
  Layers,
  FileText,
  TrendingUp,
  HelpCircle,
  Shield,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal, setIsProfileModalOpen, setIsChangePasswordModalOpen } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role?.toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                QuizPractice
              </span>

            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              Trang Chủ
            </Link>
            <Link
              to="/subjects"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/subjects') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              Môn Học & Khóa
            </Link>
            <Link
              to="/blogs"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/blogs') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              Bài Viết & Tin Tức
            </Link>

            {/* Customer Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/customer/registrations"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/customer/registrations') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  Đăng Ký Của Tôi
                </Link>
                <Link
                  to="/customer/practices"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/customer/practices') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  Luyện Tập
                </Link>
                <Link
                  to="/customer/simulation"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/customer/simulation') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  Thi Thử (Simulation)
                </Link>
              </>
            )}

            {/* Marketing / Admin */}
            {isAuthenticated && (role === 'MARKETING' || role === 'ADMIN') && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  Marketing
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                  <Link to="/marketing/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Dashboard Thống Kê
                  </Link>
                  <Link to="/marketing/blogs" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Quản Lý Bài Viết
                  </Link>
                  <Link to="/marketing/sliders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Quản Lý Sliders
                  </Link>
                </div>
              </div>
            )}

            {/* Course Content / Testing Content for Expert & Admin */}
            {isAuthenticated && (role === 'EXPERT' || role === 'ADMIN') && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  Quản Lý Môn & Đề
                </button>
                <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                  <Link to="/courses/manage" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Danh Sách Môn Học
                  </Link>
                  <Link to="/testing/questions" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Ngân Hàng Câu Hỏi
                  </Link>
                  <Link to="/testing/quizzes" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Danh Sách Đề Thi (Quizzes)
                  </Link>
                </div>
              </div>
            )}

            {/* Sale / Admin */}
            {isAuthenticated && (role === 'SALE' || role === 'ADMIN') && (
              <Link
                to="/sales/registrations"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive('/sales/registrations') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                Bán Hàng (Orders)
              </Link>
            )}

            {/* Admin Features */}
            {isAuthenticated && role === 'ADMIN' && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  Quản Trị Hệ Thống
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                  <Link to="/admin/users" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Quản Lý Người Dùng
                  </Link>
                  <Link to="/admin/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                    Cấu Hình Hệ Thống
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Right Area: Auth or User Profile */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
                >
                  <img
                    src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                    alt={user?.fullName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.fullName}</p>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{role}</span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Đăng nhập với email</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Hồ Sơ Cá Nhân
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setIsChangePasswordModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                      <Key className="w-4 h-4 text-slate-400" />
                      Đổi Mật Khẩu
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition"
                >
                  Đăng Ký
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 bg-white">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
          >
            Trang Chủ
          </Link>
          <Link
            to="/subjects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
          >
            Môn Học
          </Link>
          <Link
            to="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
          >
            Bài Viết
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/customer/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
              >
                Đăng Ký Của Tôi
              </Link>
              <Link
                to="/customer/practices"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
              >
                Luyện Tập
              </Link>
              <Link
                to="/customer/simulation"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
              >
                Thi Thử
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

