import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Plus, Search, Filter, Edit, Eye, ListOrdered,
  HelpCircle, Award, Layers, CheckCircle2, XCircle, Loader2, Save, X
} from 'lucide-react';

export default function CoursesManagementPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add Subject Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: '',
    categoryId: '',
    tagLine: '',
    briefInfo: '',
    description: '',
    thumbnailUrl: '',
    isFeatured: false,
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjRes, catRes] = await Promise.all([
        api.get('/courses/subjects'),
        api.get('/public/categories')
      ]);
      if (subjRes.success) setSubjects(subjRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      subjectName: '',
      categoryId: categories.length > 0 ? categories[0].categoryId : '',
      tagLine: '',
      briefInfo: '',
      description: '',
      thumbnailUrl: '',
      isFeatured: false,
      status: 'Published'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await api.post('/courses/subjects', formData);
      if (res.success) {
        setModalOpen(false);
        fetchData();
      } else {
        setErrorMsg(res.message || 'Lỗi khi tạo môn học');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi');
    } finally {
      setSaving(false);
    }
  };

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = !search || s.subjectName?.toLowerCase().includes(search.toLowerCase()) || s.briefInfo?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCat || s.category?.categoryId?.toString() === selectedCat;
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Quản lý Khóa học & Môn học</h1>
              <p className="text-sm text-slate-500">Quản lý danh sách môn học, kích thước kiến thức, gói giá và bài học</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Môn học Mới
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên môn học..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Published">Đã xuất bản (Published)</option>
            <option value="Draft">Bản nháp (Draft)</option>
            <option value="Archived">Đã lưu trữ (Archived)</option>
          </select>

          <span className="text-xs text-slate-500 font-medium">Tổng: {filteredSubjects.length} môn</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Không tìm thấy môn học nào</h3>
          <p className="text-sm text-slate-500 mt-1">Hãy thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Môn học</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Chuyên gia phụ trách</th>
                  <th className="px-6 py-4">Nổi bật</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.subjectId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sub.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'}
                          alt={sub.subjectName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200';
                          }}
                        />
                        <div>
                          <Link
                            to={`/courses/${sub.subjectId}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {sub.subjectName}
                          </Link>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{sub.tagLine || sub.briefInfo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                        {sub.category?.categoryName || 'Chung'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-700 font-medium">
                        {sub.owner?.fullName || 'Chưa phân công'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                          <Award className="w-3.5 h-3.5 text-amber-500" /> Nổi bật
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          sub.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sub.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sub.status === 'Published' ? 'Xuất bản' : sub.status === 'Draft' ? 'Bản nháp' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/courses/${sub.subjectId}/lessons`}
                          title="Quản lý Bài học"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/questions?subjectId=${sub.subjectId}`}
                          title="Ngân hàng Câu hỏi"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/quizzes?subjectId=${sub.subjectId}`}
                          title="Quản lý Đề thi"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <Layers className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/courses/${sub.subjectId}`}
                          title="Chi tiết & Gói giá"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Thêm Môn học Mới</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubject} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên môn học *</label>
                <input
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="VD: Software Architecture & Design (SWD392)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Published">Xuất bản (Published)</option>
                    <option value="Draft">Bản nháp (Draft)</option>
                    <option value="Archived">Lưu trữ (Archived)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tagline / Khẩu hiệu ngắn</label>
                <input
                  type="text"
                  value={formData.tagLine}
                  onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
                  placeholder="VD: Kiến trúc phần mềm chuẩn doanh nghiệp"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả ngắn (Brief Info)</label>
                <textarea
                  rows="2"
                  value={formData.briefInfo}
                  onChange={(e) => setFormData({ ...formData, briefInfo: e.target.value })}
                  placeholder="Mô tả vắn tắt hiển thị trên thẻ môn học..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả chi tiết</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nội dung khóa học, chuẩn đầu ra..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ảnh Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Đánh dấu là môn học Nổi bật (Hiển thị đầu trang chủ)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu Môn học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
