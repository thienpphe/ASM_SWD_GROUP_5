import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Clock, User, ArrowLeft, Layers, Search, Phone, Mail, ChevronRight } from 'lucide-react';

export const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/public/blogs/${id}`)
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
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Đang tải bài viết...</div>;
  }

  if (!data?.blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy bài viết</h2>
        <button
          onClick={() => navigate('/blogs')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  const { blog, latestBlogs, categories } = data;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
          </Link>

          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {blog.category?.categoryName}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <User className="w-4 h-4 text-blue-600" /> Tác giả: {blog.author?.fullName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {blog.thumbnailUrl && (
            <div className="rounded-2xl overflow-hidden max-h-96 w-full">
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {blog.briefInfo && (
            <div className="p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-xl text-slate-700 text-sm italic leading-relaxed">
              {blog.briefInfo}
            </div>
          )}

          {/* Post HTML content */}
          <div
            className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4 pt-2"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Sider (Excel #9) */}
        <aside className="space-y-6">
          {/* Post search box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tìm Kiếm</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài viết..."
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

          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Chuyên Mục
            </h3>
            <div className="space-y-1">
              {categories?.map((c) => (
                <Link
                  key={c.categoryId}
                  to={`/blogs?categoryId=${c.categoryId}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>{c.categoryName}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Posts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Bài Viết Mới Nhất
            </h3>
            <div className="space-y-3.5">
              {latestBlogs?.map((b) => (
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Hỗ Trợ Học Viên</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> (+84) 901 234 567</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> support@quizpractice.edu.vn</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

