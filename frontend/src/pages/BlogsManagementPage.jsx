import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  EyeOff, 
  Edit, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';

export const BlogsManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [briefInfo, setBriefInfo] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('Show');
  const [modalErr, setModalErr] = useState('');
  const [saving, setSaving] = useState(false);

  const loadBlogs = () => {
    setLoading(true);
    api.get('/marketing/blogs', {
      categoryId: selectedCat || undefined,
      status: selectedStatus || undefined,
      search: search || undefined,
      page,
      size: 8,
    })
      .then((res) => {
        setBlogs(res.content || []);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Load categories
    api.get('/public/home').then((data) => {
      setCategories(data?.blogCategories || []);
      if (data?.blogCategories?.length > 0 && !categoryId) {
        setCategoryId(data.blogCategories[0].categoryId);
      }
    });
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [selectedCat, selectedStatus, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadBlogs();
  };

  const handleToggleStatus = async (blogId) => {
    try {
      await api.patch(`/marketing/blogs/${blogId}/status`);
      loadBlogs();
    } catch (e) {
      alert(e.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setThumbnailUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop');
    setBriefInfo('');
    setContent('<p>Nội dung bài viết chi tiết ở đây...</p>');
    setIsFeatured(false);
    setStatus('Show');
    setModalErr('');
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBlog(b);
    setTitle(b.title);
    setCategoryId(b.category?.categoryId);
    setThumbnailUrl(b.thumbnailUrl || '');
    setBriefInfo(b.briefInfo || '');
    setContent(b.content || '');
    setIsFeatured(Boolean(b.isFeatured));
    setStatus(b.status || 'Show');
    setModalErr('');
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setModalErr('');
    setSaving(true);
    try {
      if (editingBlog) {
        await api.put(`/marketing/blogs/${editingBlog.blogId}`, {
          title,
          categoryId: Number(categoryId),
          thumbnailUrl,
          briefInfo,
          content,
          isFeatured,
          status,
        });
      } else {
        await api.post('/marketing/blogs', {
          title,
          categoryId: Number(categoryId),
          thumbnailUrl,
          briefInfo,
          content,
          isFeatured,
          status,
        });
      }
      setIsModalOpen(false);
      loadBlogs();
    } catch (e) {
      setModalErr(e.message || 'Lỗi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản Lý Bài Viết (Posts Management)</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách, tìm kiếm, ẩn/hiện, tạo mới và chỉnh sửa bài viết trên hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Thêm Bài Viết Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase">Chuyên mục:</span>
            <select
              value={selectedCat}
              onChange={(e) => { setSelectedCat(e.target.value); setPage(0); }}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="">Tất cả</option>
              <option value="Show">Hiển thị (Show)</option>
              <option value="Hidden">Ẩn (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề bài viết..."
            className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải danh sách bài viết...</div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">Không tìm thấy bài viết nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4"># ID</th>
                  <th className="py-3.5 px-4">Ảnh</th>
                  <th className="py-3.5 px-4">Tiêu Đề</th>
                  <th className="py-3.5 px-4">Chuyên Mục</th>
                  <th className="py-3.5 px-4">Tác Giả</th>
                  <th className="py-3.5 px-4">Nổi Bật</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {blogs.map((b) => (
                  <tr key={b.blogId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">#{b.blogId}</td>
                    <td className="py-3 px-4">
                      <img
                        src={b.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100"}
                        alt={b.title}
                        className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-100"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block max-w-sm truncate">{b.title}</span>
                      <span className="text-[11px] text-slate-400 block max-w-sm truncate">{b.briefInfo}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px]">
                        {b.category?.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{b.author?.fullName}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {b.isFeatured ? (
                        <span className="text-amber-600 font-bold">★ Nổi bật</span>
                      ) : (
                        <span className="text-slate-400">Thường</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Show' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(b.blogId)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          title={b.status === 'Show' ? 'Ẩn bài viết' : 'Hiện bài viết'}
                        >
                          {b.status === 'Show' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="Sửa bài viết"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-xs font-bold text-slate-600">Trang {page + 1} / {totalPages}</span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal: Post Details (Create / Edit) - Excel #21 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingBlog ? 'Chỉnh Sửa Bài Viết (Post Details)' : 'Thêm Bài Viết Mới (New Post)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalErr && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalErr}</span>
              </div>
            )}

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chuyên Mục</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trạng Thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  >
                    <option value="Show">Hiển thị (Show)</option>
                    <option value="Hidden">Ẩn (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ảnh Bìa (Thumbnail URL)</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô Tả Ngắn (Brief Info)</label>
                <textarea
                  rows="2"
                  value={briefInfo}
                  onChange={(e) => setBriefInfo(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nội Dung Bài Viết (HTML)</label>
                <textarea
                  rows="6"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Nội dung chi tiết...</p>"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="text-blue-600 rounded"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Đánh dấu là bài viết nổi bật (Featured)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

