import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const HomePage = () => {
  const { openSubjectRegisterModal } = useAuth();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    api.get('/public/home')
      .then((data) => {
        setHomeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const sliders = homeData?.sliders || [];
  const featuredBlogs = homeData?.featuredBlogs || [];
  const latestBlogs = homeData?.latestBlogs || [];
  const featuredSubjects = homeData?.featuredSubjects || [];
  const subjectCategories = homeData?.subjectCategories || [];
  const blogCategories = homeData?.blogCategories || [];

  // Auto slide every 5 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  const nextSlide = () => setSliderIndex((prev) => (prev + 1) % sliders.length);
  const prevSlide = () => setSliderIndex((prev) => (prev - 1 + sliders.length) % sliders.length);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Sliders Banner (Excel #7) */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {sliders.length > 0 ? (
          <div className="relative h-72 sm:h-96 md:h-[460px] w-full">
            {sliders.map((slider, idx) => (
              <div
                key={slider.sliderId}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === sliderIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slider.imageUrl}
                  alt={slider.title}
                  className="w-full h-full object-cover brightness-[0.45]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur">
                        <Sparkles className="w-3.5 h-3.5" /> Luyện Thi Trực Tuyến 2026
                      </span>
                      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                        {slider.title}
                      </h1>
                      {slider.notes && (
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed drop-shadow">
                          {slider.notes}
                        </p>
                      )}
                      <div className="pt-2">
                        <Link
                          to={slider.backlink || '/subjects'}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
                        >
                          Khám Phá Ngay <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Controls */}
            {sliders.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slider Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSliderIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === sliderIndex ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-3xl font-bold">Hệ Thống Luyện Thi Trắc Nghiệm QuizPractice</h1>
          </div>
        )}
      </section>

      {/* Main Grid: Content + Sider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Area: Featured Subjects + Hot Posts */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Subjects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Khóa Học Nổi Bật</h2>
                  <p className="text-sm text-slate-500">Các môn học trọng tâm có ngân hàng đề thi chuẩn hóa</p>
                </div>
                <Link
                  to="/subjects"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                  Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredSubjects.map((sub) => (
                  <div
                    key={sub.subjectId}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col"
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
                        <Link
                          to={`/subjects/${sub.subjectId}`}
                          className="text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                        >
                          Chi Tiết Môn Học
                        </Link>
                        <button
                          onClick={() => openSubjectRegisterModal(sub)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                        >
                          Đăng Ký Học
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Posts (Blogs) */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bài Viết Nổi Bật</h2>
                  <p className="text-sm text-slate-500">Kinh nghiệm làm bài thi, phân tích kiến trúc phần mềm</p>
                </div>
                <Link
                  to="/blogs"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                  Xem bài viết <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBlogs.map((blog) => (
                  <div
                    key={blog.blogId}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                        Hot Post
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                          <span>{blog.category?.categoryName}</span>
                          <span>•</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <Link to={`/blogs/${blog.blogId}`}>
                          <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition line-clamp-2">
                            {blog.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {blog.briefInfo}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Tác giả: {blog.author?.fullName}</span>
                        <Link to={`/blogs/${blog.blogId}`} className="text-blue-600 font-bold hover:underline">
                          Đọc tiếp →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sider (Excel #7, #8, #10) */}
          <aside className="space-y-6">
            {/* Latest Posts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
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

            {/* Subject Categories */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> Danh Mục Khóa Học
              </h3>
              <div className="space-y-1">
                {subjectCategories.map((c) => (
                  <Link
                    key={c.categoryId}
                    to={`/subjects?categoryId=${c.categoryId}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <span>{c.categoryName}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Static Contacts & Help Info */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-300">
                  Hỗ Trợ Học Tập
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  Cần trợ giúp trong quá trình ôn luyện thi?
                </h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Đội ngũ cố vấn học tập luôn sẵn sàng giải đáp thắc mắc về đề thi và kiến thức chuyên môn.
                </p>
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Hotline: 0901 234 567</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>support@quizpractice.edu.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

