import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Search, 
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const SubjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSubjectRegisterModal } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/public/subjects/${id}`)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Đang tải thông tin môn học...</div>;
  }

  if (!data?.subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy môn học</h2>
        <button
          onClick={() => navigate('/subjects')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh mục môn học
        </button>
      </div>
    );
  }

  const { subject, packages = [], dimensions = [], lessons = [], lowestPrice, categories = [], featuredSubjects = [] } = data;

  const formatVND = (num) => {
    if (!num) return '0 VNĐ';
    return Number(num).toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/subjects?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-3 space-y-8">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh mục môn học
          </Link>

          {/* Hero Banner Box */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img
                  src={subject.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"}
                  alt={subject.subjectName}
                  className="w-full h-56 rounded-2xl object-cover shadow-md"
                />
              </div>

              <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {subject.category?.categoryName}
                    </span>
                    {subject.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white">
                        Nổi Bật
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {subject.subjectName}
                  </h1>
                  <p className="text-sm font-semibold text-blue-600 mt-1">{subject.tagLine}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {subject.briefInfo}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Học phí ưu đãi từ</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-blue-600">
                        {lowestPrice ? formatVND(lowestPrice.salePrice) : '350.000 VNĐ'}
                      </span>
                      {lowestPrice && lowestPrice.listPrice > lowestPrice.salePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatVND(lowestPrice.listPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openSubjectRegisterModal(subject)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Đăng Ký Khóa Học Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Mô Tả Chi Tiết Môn Học
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{subject.description || 'Chưa có thông tin mô tả chi tiết cho môn học này.'}</p>
            </div>
          </div>

          {/* Price Packages Table (Excel #11, Document Page 10) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Các Gói Học Phí (Price Packages)
              </h2>
              <span className="text-xs text-slate-500 font-medium">Bảo hành hỗ trợ trọn gói</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Tên Gói</th>
                    <th className="py-3 px-3">Thời Hạn</th>
                    <th className="py-3 px-3">Giá Niêm Yết</th>
                    <th className="py-3 px-3">Giá Khuyến Mãi</th>
                    <th className="py-3 px-3 text-right">Đăng Ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {packages.map((pkg, idx) => (
                    <tr key={pkg.packageId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{pkg.packageName}</td>
                      <td className="py-3 px-3">{pkg.accessDurationMonths} tháng</td>
                      <td className="py-3 px-3 text-slate-400 line-through">{formatVND(pkg.listPrice)}</td>
                      <td className="py-3 px-3 font-bold text-blue-600">{formatVND(pkg.salePrice)}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => openSubjectRegisterModal(subject, pkg)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                        >
                          Chọn Gói
                        </button>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">
                        Chưa có gói học phí nào được công bố.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Dimensions (Document Page 10) */}
          {dimensions.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Các Chiều Kiến Thức (Subject Dimensions)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Loại (Type)</th>
                      <th className="py-2.5 px-3">Tên Chiều (Dimension)</th>
                      <th className="py-2.5 px-3">Mô Tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {dimensions.map((dim, idx) => (
                      <tr key={dim.dimensionId} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {dim.dimensionType?.value || 'Domain'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{dim.dimensionName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{dim.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sider (Excel #11) */}
        <aside className="space-y-6">
          {/* Search Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tìm Kiếm Môn Học</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm môn..."
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Subject Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Ngành / Chuyên Mục
            </h3>
            <div className="space-y-1">
              {categories.map((c) => (
                <Link
                  key={c.categoryId}
                  to={`/subjects?categoryId=${c.categoryId}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>{c.categoryName}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Subjects */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Môn Nổi Bật Khác
            </h3>
            <div className="space-y-3">
              {featuredSubjects.filter(s => s.subjectId !== subject.subjectId).slice(0, 3).map((s) => (
                <Link
                  key={s.subjectId}
                  to={`/subjects/${s.subjectId}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={s.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100"}
                    alt={s.subjectName}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                      {s.subjectName}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{s.tagLine}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Static Contacts */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Hỗ Trợ Học Viên</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> 0901 234 567</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> support@quizpractice.edu.vn</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

