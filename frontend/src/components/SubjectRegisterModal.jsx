import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { X, CheckCircle, AlertCircle, ShoppingCart, ShieldCheck } from 'lucide-react';

export const SubjectRegisterModal = () => {
  const { user, isAuthenticated, subjectRegisterState, closeSubjectRegisterModal } = useAuth();
  const { isOpen, subject, selectedPackage } = subjectRegisterState;

  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && subject) {
      setSuccess(false);
      setErr('');
      // Pre-fill user contact info if logged in
      if (isAuthenticated && user) {
        setFullName(user.fullName || '');
        setEmail(user.email || '');
        setMobile(user.mobile || '');
        setGender(user.gender || 'Male');
      } else {
        setFullName('');
        setEmail('');
        setMobile('');
        setGender('Male');
      }

      // Fetch packages for this subject
      api.get(`/courses/subjects/${subject.subjectId}/packages`)
        .then((res) => {
          setPackages(res || []);
          if (selectedPackage) {
            setPackageId(selectedPackage.packageId);
          } else if (res && res.length > 0) {
            setPackageId(res[0].packageId);
          }
        })
        .catch(() => {
          setPackages([]);
        });
    }
  }, [isOpen, subject, selectedPackage, isAuthenticated, user]);

  if (!isOpen || !subject) return null;

  const currentPkg = packages.find((p) => p.packageId === Number(packageId)) || selectedPackage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageId) {
      setErr('Vui lòng chọn một gói học phí');
      return;
    }
    setErr('');
    setLoading(true);
    try {
      await api.post('/public/register-subject', {
        subjectId: subject.subjectId,
        packageId: Number(packageId),
        fullName,
        email,
        mobile,
        gender,
        notes,
      });
      setSuccess(true);
    } catch (e) {
      setErr(e.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (num) => {
    if (!num) return '0 VNĐ';
    return Number(num).toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Đăng Ký Khóa Học</h2>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs">{subject.subjectName}</p>
            </div>
          </div>
          <button
            onClick={closeSubjectRegisterModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Đăng Ký Thành Công!</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yêu cầu đăng ký môn <strong>{subject.subjectName}</strong> đã được gửi lên hệ thống. Đội ngũ Sales sẽ liên hệ xác nhận và kích hoạt quyền làm bài thi cho bạn.
            </p>
            <button
              onClick={closeSubjectRegisterModal}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition"
            >
              Đã Hiểu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {err && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{err}</span>
              </div>
            )}

            {/* Choose Package */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Chọn gói thời hạn học
              </label>
              <div className="space-y-2">
                {packages.map((pkg) => (
                  <label
                    key={pkg.packageId}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      packageId === pkg.packageId
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="packageRadio"
                        checked={packageId === pkg.packageId}
                        onChange={() => setPackageId(pkg.packageId)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{pkg.packageName}</p>
                        <p className="text-xs text-slate-500">Thời hạn: {pkg.accessDurationMonths} tháng</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-blue-600">{formatVND(pkg.salePrice)}</p>
                      {pkg.listPrice > pkg.salePrice && (
                        <p className="text-xs text-slate-400 line-through">{formatVND(pkg.listPrice)}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information (Read-only if logged in or editable) */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thông Tin Liên Hệ</span>
                {isAuthenticated && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Tự động điền theo tài khoản
                  </span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  required
                  disabled={isAuthenticated}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ và tên"
                  className={`w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl ${
                    isAuthenticated ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-slate-50 focus:bg-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  disabled={isAuthenticated}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email nhận thông báo"
                  className={`w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl ${
                    isAuthenticated ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-slate-50 focus:bg-white'
                  }`}
                />
                <input
                  type="tel"
                  required
                  disabled={isAuthenticated}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Số điện thoại"
                  className={`w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl ${
                    isAuthenticated ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-slate-50 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú (nếu có): ví dụ hình thức chuyển khoản, yêu cầu đặc biệt..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium">Tổng học phí</p>
                <p className="text-lg font-black text-blue-600">
                  {currentPkg ? formatVND(currentPkg.salePrice) : '0 VNĐ'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeSubjectRegisterModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Xác Nhận Đăng Ký'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

