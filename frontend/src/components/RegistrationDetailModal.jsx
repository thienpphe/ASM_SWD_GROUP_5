import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  X, CheckCircle2, AlertCircle, Calendar, User, Mail, Phone,
  CreditCard, BookOpen, Clock, FileText, Loader2, Save
} from 'lucide-react';

export default function RegistrationDetailModal({ isOpen, onClose, registrationId, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [reg, setReg] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (isOpen && registrationId) {
      const fetchDetail = async () => {
        setLoading(true);
        setMsg(null);
        try {
          const res = await api.get(`/sales/registrations/${registrationId}`);
          if (res.success) {
            const data = res.data;
            setReg(data);
            setStatus(data.status || 'Submitted');
            setNotes(data.notes || '');
            setValidFrom(data.validFrom ? data.validFrom.substring(0, 10) : '');
            setValidTo(data.validTo ? data.validTo.substring(0, 10) : '');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isOpen, registrationId]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await api.put(`/sales/registrations/${registrationId}`, {
        status,
        notes,
        validFrom: validFrom ? `${validFrom}T00:00:00` : null,
        validTo: validTo ? `${validTo}T23:59:59` : null
      });

      if (res.success) {
        setMsg({ type: 'success', text: 'Cập nhật đơn đăng ký thành công! Đã đồng bộ tài khoản học viên.' });
        if (onUpdated) onUpdated();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setMsg({ type: 'error', text: res.message || 'Lỗi khi cập nhật đơn đăng ký' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Chi tiết Đơn Đăng ký #{registrationId}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Xác nhận thanh toán và kích hoạt thời hạn học tập</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : !reg ? (
          <div className="p-8 text-center text-slate-500">Không tìm thấy thông tin đơn hàng</div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-5">
            {msg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  msg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{msg.text}</span>
              </div>
            )}

            {/* Customer Details Box */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 space-y-3">
              <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Thông tin Khách hàng</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Họ và tên:</span>
                  <span className="font-bold text-slate-800">{reg.user?.fullName || reg.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email liên hệ:</span>
                  <span className="font-bold text-indigo-600">{reg.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số điện thoại:</span>
                  <span className="font-medium text-slate-800">{reg.user?.phone || 'Chưa cung cấp'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Thời gian đăng ký:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(reg.registrationTime).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Course & Package Info */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 space-y-3">
              <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Môn học & Gói thanh toán</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Môn học:</span>
                  <span className="font-bold text-slate-900">{reg.subject?.subjectName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gói đăng ký:</span>
                  <span className="font-bold text-purple-700">{reg.pricePackage?.packageName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Học phí niêm yết:</span>
                  <span className="text-slate-500 line-through">
                    {Number(reg.pricePackage?.listPrice || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Học phí thực thu:</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {Number(reg.totalCost || reg.pricePackage?.salePrice || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Validity Controls */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Cập nhật Trạng thái Đơn hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái Đơn *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white font-semibold"
                  >
                    <option value="Submitted">Chờ thanh toán (Submitted)</option>
                    <option value="Paid">Đã thanh toán (Paid - Kích hoạt)</option>
                    <option value="Cancelled">Đã hủy bỏ (Cancelled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ghi chú (Notes)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mã giao dịch, ngân hàng chuyển khoản..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hiệu lực từ ngày</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hiệu lực đến ngày</label>
                  <input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {status === 'Paid' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  <p className="font-bold">Lưu ý khi duyệt "Đã thanh toán (Paid)":</p>
                  <p className="mt-0.5">
                    Hệ thống sẽ tự động kích hoạt tài khoản học viên và cấp quyền truy cập toàn bộ bài học & đề thi của môn học này.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu Thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
