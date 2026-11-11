import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Award, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

export const MarketingDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/marketing/dashboard')
      .then((res) => {
        setStats(res);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const formatVND = (num) => {
    if (!num) return '0 VNĐ';
    return Number(num).toLocaleString('vi-VN') + ' VNĐ';
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Đang tải dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Quản Lý & Thống Kê</h1>
        <p className="text-sm text-slate-500 mt-1">Tổng quan chỉ số hiệu suất hệ thống dành cho Admin, Sales và Marketing</p>
      </div>

      {/* 5 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Người Dùng</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.totalUsers || 0}</span>
            <Link to="/admin/users" className="text-[11px] font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
              Quản lý <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Subjects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Môn Học</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.totalSubjects || 0}</span>
            <Link to="/courses/manage" className="text-[11px] font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
              Xem môn <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Đơn Đăng Ký</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.totalRegistrations || 0}</span>
            <Link to="/sales/registrations" className="text-[11px] font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
              Đơn hàng <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Practices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Lượt Luyện Tập</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.totalPractices || 0}</span>
            <Link to="/customer/practices" className="text-[11px] font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
              Lịch sử <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 5: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tổng Doanh Thu</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block truncate max-w-[120px]">
              {formatVND(stats?.totalRevenue)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Đã thanh toán
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Hot Subjects Ranking & Quick Navigation Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hot Subjects Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Top Khóa Học Được Quan Tâm Nhất</h2>
              <p className="text-xs text-slate-400">Xếp hạng theo số lượt đăng ký của học viên</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>

          <div className="space-y-3 pt-2">
            {stats?.hotSubjects?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-500 text-white shadow-sm' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-800 truncate">{item.subjectName}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-blue-600">{item.registrationsCount}</span>
                  <span className="text-xs text-slate-400 ml-1">đơn đăng ký</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Functional Links (Excel #19: relevant links to the related screens) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Truy Cập Nhanh Tính Năng
          </h2>

          <div className="space-y-2.5">
            <Link
              to="/marketing/blogs"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Quản Lý Bài Viết (Posts)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/marketing/sliders"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-2"><Sliders className="w-4 h-4 text-indigo-500" /> Quản Lý Sliders Banner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/sales/registrations"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-amber-500" /> Đơn Đăng Ký & Thanh Toán</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/testing/questions"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-500" /> Ngân Hàng Câu Hỏi & Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Quản Trị Người Dùng & Phân Quyền</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

