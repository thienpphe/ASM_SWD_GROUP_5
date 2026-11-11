import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Search, Layers, ChevronRight, Phone, Mail, Sparkles, ShoppingBag } from 'lucide-react';

export const SubjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openSubjectRegisterModal } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredSubjects, setFeaturedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const selectedCategory = searchParams.get('categoryId') || '';

  useEffect(() => {
    api.get('/public/home').then((data) => {
      setCategories(data?.subjectCategories || []);
      setFeaturedSubjects(data?.featuredSubjects || []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/public/subjects', {
      categoryId: selectedCategory,
      search: searchParams.get('search') || '',
      page,
      size: 6,
    })
      .then((res) => {
        setSubjects(res.content || []);
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

  const formatVND = (num) => {
    if (!num) return '0 VNĐ';
    return Number(num).toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Danh Mục Khóa Học & Đề Thi</h1>
        <p className="text-sm text-slate-500 mt-1">Các môn học trọng tâm kèm ngân hàng câu hỏi và kỳ thi thử mô phỏng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Đang tải danh sách môn học...</div>
          ) : subjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-base font-semibold text-slate-700">Không tìm thấy môn học nào phù hợp.</p>
              <button
                onClick={() => { setSearch(''); setSearchParams({}); }}
                className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs"
              >
                Xem tất cả môn học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((sub) => (
                <div
                  key={sub.subjectId}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={sub.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"}
                      alt={sub.subjectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 text-blue-700 backdrop-blur shadow-sm">
                      {sub.category?.categoryName || 'Chung'}
                    </span>
                    {sub.isFeatured && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Nổi Bật
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/subjects/${sub.subjectId}`}>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                          {sub.subjectName}
                        </h3>
                      </Link>
                      <p className="text-xs text-blue-600 font-semibold mt-1 line-clamp-1">{sub.tagLine}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {sub.briefInfo || sub.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Học phí từ</span>
                        <span className="text-sm font-extrabold text-blue-600">350.000 VNĐ</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/subjects/${sub.subjectId}`}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                        >
                          Chi Tiết
                        </Link>
                        <button
                          onClick={() => openSubjectRegisterModal(sub)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Đăng Ký
                        </button>
                      </div>
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

        {/* Sider (Excel #10) */}
        <aside className="space-y-6">
          {/* Subject search box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tìm Kiếm Môn Học</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã hoặc tên môn..."
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
              <button
                onClick={() => selectCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  !selectedCategory ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Tất cả môn học</span>
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

          {/* Featured Subjects Sider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Môn Trọng Điểm
            </h3>
            <div className="space-y-3">
              {featuredSubjects.map((s) => (
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Tư Vấn Gói Khóa Học</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Liên hệ nhân viên tư vấn để nhận ưu đãi đăng ký theo nhóm hoặc gói tài khoản thời hạn dài.
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

