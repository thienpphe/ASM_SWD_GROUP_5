import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Search, Clock, User, Layers, ArrowRight, ChevronRight, Phone, Mail } from 'lucide-react';

export const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setBlogCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const selectedCategory = searchParams.get('categoryId') || '';

  useEffect(() => {
    // Load categories and latest
    api.get('/public/home').then((data) => {
      setBlogCategories(data?.blogCategories || []);
      setLatestBlogs(data?.latestBlogs || []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/public/blogs', {
      categoryId: selectedCategory,
      search: searchParams.get('search') || '',
      page,
      size: 6,
    })
      .then((res) => {
        setBlogs(res.content || []);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory, searchParams, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      ...(selectedCategory ? { categoryId: selectedCategory } : {}),
      ...(search ? { search } : {}),
    });
    setPage(0);
  };

  const selectCategory = (catId) => {
    if (selectedCategory === String(catId)) {
      searchParams.delete('categoryId');
    } else {
      searchParams.set('categoryId', catId);
    }
    setSearchParams(searchParams);
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bài Viết & Tin Tức Học Tập</h1>
        <p className="text-sm text-slate-500 mt-1">Kinh nghiệm giải đề, kiến trúc phần mềm và cập nhật kiến thức chuyên môn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Đang tải danh sách bài viết...</div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-base font-semibold text-slate-700">Không tìm thấy bài viết nào phù hợp.</p>
              <button
                onClick={() => { setSearch(''); setSearchParams({}); }}
                className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((b) => (
                <div
                  key={b.blogId}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={b.thumbnailUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 text-blue-700 backdrop-blur shadow-sm">
                      {b.category?.categoryName}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <Link to={`/blogs/${b.blogId}`}>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                          {b.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {b.briefInfo}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {b.author?.fullName}
                      </span>
                      <Link
                        to={`/blogs/${b.blogId}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Đọc chi tiết <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-40"
              >
                Trang Trước
              </button>
              <span className="text-xs font-bold text-slate-600">
                Trang {page + 1} / {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-40"
              >
                Trang Sau
              </button>
            </div>
          )}
        </div>

        {/* Sider (Excel #8) */}
        <aside className="space-y-6">
          {/* Search Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tìm Kiếm Bài Viết</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
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

          {/* Post Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Chuyên Mục Bài Viết
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => selectCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  !selectedCategory ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Tất cả bài viết</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.categoryId}
                  onClick={() => selectCategory(c.categoryId)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    selectedCategory === String(c.categoryId) ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.categoryName}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Latest Posts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Bài Viết Mới Nhất
            </h3>
            <div className="space-y-3.5">
              {latestBlogs.map((b) => (
                <Link
                  key={b.blogId}
                  to={`/blogs/${b.blogId}`}
                  className="flex gap-3 group items-start"
                >
                  <img
                    src={b.thumbnailUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=100"}
                    alt={b.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-tight">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Static Contacts */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">QuizPractice Hub</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Kênh chia sẻ kiến thức ôn thi trắc nghiệm phần mềm dành cho sinh viên và lập trình viên.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> 0901 234 567</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> support@quizpractice.edu.vn</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

