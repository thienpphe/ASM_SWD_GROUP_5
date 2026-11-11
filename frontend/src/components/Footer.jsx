import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">QuizPractice</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hệ thống ôn luyện thi trắc nghiệm trực tuyến chuẩn quốc tế. Cung cấp bài thi thử mô phỏng (Simulation Exam) và tính năng xem gợi ý đáp án chi tiết.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              SWD392 Project - Group 5
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Môn Học Nổi Bật</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/subjects" className="hover:text-white transition">SWD392 - Software Architecture</a></li>
              <li><a href="/subjects" className="hover:text-white transition">PRJ301 - Java Web Development</a></li>
              <li><a href="/subjects" className="hover:text-white transition">CSD201 - Data Structures</a></li>
              <li><a href="/subjects" className="hover:text-white transition">PRN231 - Cloud Services</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Tính Năng Cốt Lõi</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/customer/practices" className="hover:text-white transition">Luyện tập theo Topic/Dimension</a></li>
              <li><a href="/customer/simulation" className="hover:text-white transition">Thi thử tính giờ đếm ngược</a></li>
              <li><a href="/blogs" className="hover:text-white transition">Kho kinh nghiệm ôn thi & Blog</a></li>
              <li><a href="/customer/registrations" className="hover:text-white transition">Quản lý khóa học đã đăng ký</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Liên Hệ & Hỗ Trợ</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Khu Công nghệ cao Hòa Lạc, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>(+84) 901 234 567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@quizpractice.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 QuizPractice System. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

