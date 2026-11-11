import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, ArrowLeft, Layers, Tag, DollarSign, Plus, Edit, Trash2,
  Save, CheckCircle2, XCircle, Loader2, X, ListOrdered, HelpCircle
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, dimensions, packages
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savingOverview, setSavingOverview] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Overview Form
  const [overviewForm, setOverviewForm] = useState({
    subjectName: '',
    categoryId: '',
    tagLine: '',
    briefInfo: '',
    description: '',
    thumbnailUrl: '',
    isFeatured: false,
    status: 'Published'
  });

  // Dimension Modal
  const [dimModalOpen, setDimModalOpen] = useState(false);
  const [dimForm, setDimForm] = useState({ dimensionName: '', description: '' });
  const [dimSaving, setDimSaving] = useState(false);

  // Package Modal
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgForm, setPkgForm] = useState({
    packageName: '',
    accessDurationMonths: 3,
    listPrice: 0,
    salePrice: 0,
    status: 'Active',
    description: ''
  });
  const [pkgSaving, setPkgSaving] = useState(false);

  const fetchSubjectData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/subjects/${id}/details`);
      if (res.success) {
        const data = res.data;
        setSubject(data.subject);
        setDimensions(data.dimensions || []);
        setPackages(data.packages || []);
        setCategories(data.allCategories || []);

        const sub = data.subject || {};
        setOverviewForm({
          subjectName: sub.subjectName || '',
          categoryId: sub.category?.categoryId || '',
          tagLine: sub.tagLine || '',
          briefInfo: sub.briefInfo || '',
          description: sub.description || '',
          thumbnailUrl: sub.thumbnailUrl || '',
          isFeatured: sub.isFeatured || false,
          status: sub.status || 'Published'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectData();
  }, [id]);

  // Handle Overview Save
  const handleSaveOverview = async (e) => {
    e.preventDefault();
    setSavingOverview(true);
    setStatusMsg('');
    try {
      const res = await api.put(`/courses/subjects/${id}`, overviewForm);
      if (res.success) {
        setStatusMsg('Cập nhật thông tin môn học thành công!');
        fetchSubjectData();
      } else {
        setStatusMsg('Lỗi: ' + res.message);
      }
    } catch (err) {
      setStatusMsg('Lỗi: ' + err.message);
    } finally {
      setSavingOverview(false);
    }
  };

  // Dimensions
  const handleOpenAddDim = () => {
    setDimForm({ dimensionName: '', description: '' });
    setDimModalOpen(true);
  };

  const handleSaveDimension = async (e) => {
    e.preventDefault();
    setDimSaving(true);
    try {
      const res = await api.post('/courses/dimensions', {
        subjectId: id,
        dimensionName: dimForm.dimensionName,
        description: dimForm.description
      });
      if (res.success) {
        setDimModalOpen(false);
        fetchSubjectData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDimSaving(false);
    }
  };

  const handleDeleteDimension = async (dimId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dimension này?')) return;
    try {
      const res = await api.delete(`/courses/dimensions/${dimId}`);
      if (res.success) {
        fetchSubjectData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Packages
  const handleOpenAddPkg = () => {
    setEditingPkg(null);
    setPkgForm({
      packageName: '',
      accessDurationMonths: 3,
      listPrice: 500000,
      salePrice: 350000,
      status: 'Active',
      description: ''
    });
    setPkgModalOpen(true);
  };

  const handleOpenEditPkg = (pkg) => {
    setEditingPkg(pkg);
    setPkgForm({
      packageName: pkg.packageName,
      accessDurationMonths: pkg.accessDurationMonths,
      listPrice: pkg.listPrice,
      salePrice: pkg.salePrice,
      status: pkg.status,
      description: pkg.description || ''
    });
    setPkgModalOpen(true);
  };

  const handleSavePkg = async (e) => {
    e.preventDefault();
    setPkgSaving(true);
    try {
      let res;
      if (editingPkg) {
        res = await api.put(`/courses/packages/${editingPkg.packageId}`, {
          subjectId: id,
          ...pkgForm
        });
      } else {
        res = await api.post('/courses/packages', {
          subjectId: id,
          ...pkgForm
        });
      }
      if (res.success) {
        setPkgModalOpen(false);
        fetchSubjectData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setPkgSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Danh sách Môn học
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{subject?.subjectName}</h1>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                subject?.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {subject?.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/courses/${id}/lessons`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
            Quản lý Bài học
          </Link>
          <Link
            to={`/questions?subjectId=${id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Ngân hàng Câu hỏi
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-5 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Tổng quan & Nội dung
        </button>
        <button
          onClick={() => setActiveTab('dimensions')}
          className={`pb-3 px-5 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'dimensions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Kích thước Kiến thức ({dimensions.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3 px-5 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'packages'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Gói học phí ({packages.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {statusMsg && (
            <div className={`p-4 rounded-xl text-sm mb-6 ${statusMsg.includes('Lỗi') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSaveOverview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên môn học *</label>
                <input
                  type="text"
                  required
                  value={overviewForm.subjectName}
                  onChange={(e) => setOverviewForm({ ...overviewForm, subjectName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Danh mục môn học *</label>
                <select
                  value={overviewForm.categoryId}
                  onChange={(e) => setOverviewForm({ ...overviewForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái phát hành</label>
                <select
                  value={overviewForm.status}
                  onChange={(e) => setOverviewForm({ ...overviewForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="Published">Đã xuất bản (Published)</option>
                  <option value="Draft">Bản nháp (Draft)</option>
                  <option value="Archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  value={overviewForm.thumbnailUrl}
                  onChange={(e) => setOverviewForm({ ...overviewForm, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tagline vắn tắt</label>
              <input
                type="text"
                value={overviewForm.tagLine}
                onChange={(e) => setOverviewForm({ ...overviewForm, tagLine: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thông tin vắn tắt (Brief Info)</label>
              <textarea
                rows="2"
                value={overviewForm.briefInfo}
                onChange={(e) => setOverviewForm({ ...overviewForm, briefInfo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả đầy đủ (Description)</label>
              <textarea
                rows="6"
                value={overviewForm.description}
                onChange={(e) => setOverviewForm({ ...overviewForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={overviewForm.isFeatured}
                onChange={(e) => setOverviewForm({ ...overviewForm, isFeatured: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Đánh dấu là môn học Nổi bật trên Trang chủ
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingOverview}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm disabled:opacity-50 transition-all"
              >
                {savingOverview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu Thay đổi Tổng quan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: DIMENSIONS */}
      {activeTab === 'dimensions' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-slate-500">Các chiều kiến thức phân loại cho ngân hàng câu hỏi và ma trận đề thi</p>
            <button
              onClick={handleOpenAddDim}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm Dimension Mới
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tên Dimension</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dimensions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      Chưa có dimension nào. Hãy thêm một kích thước kiến thức mới.
                    </td>
                  </tr>
                ) : (
                  dimensions.map((dim) => (
                    <tr key={dim.dimensionId} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{dim.dimensionId}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{dim.dimensionName}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{dim.description || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteDimension(dim.dimensionId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa Dimension"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRICE PACKAGES */}
      {activeTab === 'packages' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-slate-500">Các gói đăng ký học viên có thể mua để truy cập môn học</p>
            <button
              onClick={handleOpenAddPkg}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm Gói Giá Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.packageId}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      {pkg.accessDurationMonths} Tháng
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        pkg.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-2">{pkg.packageName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{pkg.description || 'Truy cập đầy đủ học liệu và ngân hàng đề thi.'}</p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {Number(pkg.salePrice).toLocaleString('vi-VN')} đ
                    </span>
                    {Number(pkg.listPrice) > Number(pkg.salePrice) && (
                      <span className="text-xs text-slate-400 line-through">
                        {Number(pkg.listPrice).toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleOpenEditPkg(pkg)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dimension Modal */}
      {dimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Thêm Dimension Mới</h2>
              <button
                onClick={() => setDimModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDimension} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Dimension *</label>
                <input
                  type="text"
                  required
                  value={dimForm.dimensionName}
                  onChange={(e) => setDimForm({ ...dimForm, dimensionName: e.target.value })}
                  placeholder="VD: Software Architecture Patterns, SOLID Principles"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả</label>
                <textarea
                  rows="3"
                  value={dimForm.description}
                  onChange={(e) => setDimForm({ ...dimForm, description: e.target.value })}
                  placeholder="Mô tả phạm vi kiến thức..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDimModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={dimSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {dimSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu Dimension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Modal */}
      {pkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingPkg ? 'Chỉnh sửa Gói Giá' : 'Thêm Gói Giá Mới'}
              </h2>
              <button
                onClick={() => setPkgModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePkg} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Gói *</label>
                <input
                  type="text"
                  required
                  value={pkgForm.packageName}
                  onChange={(e) => setPkgForm({ ...pkgForm, packageName: e.target.value })}
                  placeholder="VD: Gói Chuẩn 3 Tháng"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thời hạn (Tháng) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pkgForm.accessDurationMonths}
                    onChange={(e) => setPkgForm({ ...pkgForm, accessDurationMonths: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                  <select
                    value={pkgForm.status}
                    onChange={(e) => setPkgForm({ ...pkgForm, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Active">Hoạt động (Active)</option>
                    <option value="Inactive">Ngừng áp dụng (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giá gốc (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={pkgForm.listPrice}
                    onChange={(e) => setPkgForm({ ...pkgForm, listPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giá bán khuyến mãi (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={pkgForm.salePrice}
                    onChange={(e) => setPkgForm({ ...pkgForm, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả quyền lợi</label>
                <textarea
                  rows="2"
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  placeholder="VD: Không giới hạn luyện tập, hỗ trợ giải đáp 24/7..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPkgModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={pkgSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {pkgSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingPkg ? 'Lưu Gói Giá' : 'Thêm Gói'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
