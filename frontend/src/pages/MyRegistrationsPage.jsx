import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  ShoppingBag,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';

export const MyRegistrationsPage = () => {
  const { openSubjectRegisterModal } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    api.get('/customer/registrations')
      .then((res) => {
        setRegistrations(res || []);
        setLoading(false);
      })
      .catch((e) => {
        setErr(e.message || 'Không thể tải danh sách đăng ký');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đăng ký khóa học này không?')) return;
    try {
      await api.post(`/customer/registrations/${id}/cancel`);
      setMsg('Đã hủy đăng ký thành công');
      loadData();
    } catch (e) {
      setErr(e.message || 'Hủy đăng ký thất bại');
    }
  };

  const formatVND = (num) => {
    if (!num) return '0 VNĐ';
    return Number(num).toLocaleString('vi-VN') + ' VNĐ';
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" /> Đã Kích Hoạt (Paid)
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Chờ Thanh Toán (Submitted)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5" /> Đã Hủy (Cancelled)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Đăng Ký Của Tôi</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý các khóa học đã đăng ký, thời hạn hiệu lực và trạng thái thanh toán</p>
        </div>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" /> Đăng Ký Môn Mới
        </Link>
      </div>

      {err && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {msg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải danh sách đăng ký...</div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Bạn chưa đăng ký khóa học nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Khám phá danh mục môn học kiến trúc phần mềm, lập trình web và khoa học máy tính để bắt đầu ôn luyện.
          </p>
          <Link
            to="/subjects"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            Xem Danh Mục Môn Học <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">Mã Đơn (#)</th>
                  <th className="py-3.5 px-4">Môn Học</th>
                  <th className="py-3.5 px-4">Gói Học Phí</th>
                  <th className="py-3.5 px-4">Thời Gian Đăng Ký</th>
                  <th className="py-3.5 px-4">Tổng Học Phí</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Thời Hạn Hiệu Lực</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {registrations.map((reg) => (
                  <tr key={reg.registrationId} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      #{reg.registrationId}
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/subjects/${reg.subject?.subjectId}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition block truncate max-w-xs"
                      >
                        {reg.subject?.subjectName}
                      </Link>
                      <span className="text-[11px] text-slate-400 block truncate">{reg.subject?.tagLine}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{reg.pricePackage?.packageName}</span>
                      <span className="text-[11px] text-slate-400 block">
                        ({reg.pricePackage?.accessDurationMonths} tháng)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(reg.registrationTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600 whitespace-nowrap">
                      {formatVND(reg.totalCost)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {reg.validFrom && reg.validTo ? (
                        <span>
                          {new Date(reg.validFrom).toLocaleDateString('vi-VN')} → {new Date(reg.validTo).toLocaleDateString('vi-VN')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chờ kích hoạt</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {reg.status?.toLowerCase() === 'submitted' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openSubjectRegisterModal(reg.subject, reg.pricePackage)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1"
                            title="Sửa thông tin đăng ký"
                          >
                            <Edit className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button
                            onClick={() => handleCancel(reg.registrationId)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1"
                            title="Hủy đơn đăng ký"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hủy
                          </button>
                        </div>
                      )}
                      {reg.status?.toLowerCase() === 'paid' && (
                        <Link
                          to="/customer/practices"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          Luyện Tập Ngay
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

