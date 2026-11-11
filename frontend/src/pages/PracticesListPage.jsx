import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { 
  PlusCircle, 
  Clock, 
  Award, 
  CheckCircle, 
  FileText, 
  PlayCircle,
  Eye,
  Filter
} from 'lucide-react';

export const PracticesListPage = () => {
  const navigate = useNavigate();
  const [practices, setPractices] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subjects for filter
    api.get('/customer/practices/subjects').then((res) => {
      setSubjects(res || []);
    });

    // Load user's practice test history
    api.get('/customer/practices')
      .then((res) => {
        setPractices(res || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filteredPractices = selectedSubject === 'All'
    ? practices
    : practices.filter((p) => p.subjectName === selectedSubject);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header with action buttons matching mockup (Doc Page 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lịch Sử Luyện Tập (Practices List)</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách các bài luyện tập và bài thi bạn đã hoàn thành</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/customer/practices/new"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> New Practice
          </Link>
          <Link
            to="/customer/simulation"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
          >
            <Award className="w-4 h-4" /> Simulation Exam
          </Link>
        </div>
      </div>

      {/* Filter by subject */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lọc theo môn học:</span>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
        >
          <option value="All">Tất cả môn học (All subjects)</option>
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectName}>
              {s.subjectName}
            </option>
          ))}
        </select>
      </div>

      {/* Practices Cards List (Matching screen layout from Doc Page 5) */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải lịch sử làm bài...</div>
      ) : filteredPractices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Chưa có bài luyện tập nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bấm vào nút <strong>New Practice</strong> để tạo một bài luyện tập mới theo Topic hoặc Dimension.
          </p>
          <Link
            to="/customer/practices/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
          >
            <PlusCircle className="w-4 h-4" /> Tạo Bài Luyện Mới
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPractices.map((p) => {
            const isDone = p.status === 'Submitted';
            return (
              <div
                key={p.sessionId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {p.testType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{p.subjectName}</h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{p.examName}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Thời gian: {p.durationFormatted}
                    </span>
                    <span>•</span>
                    <span>Ngày làm: {new Date(p.startedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {/* Right Results & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Score Counts */}
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-emerald-600 font-extrabold">{p.correctCount} Correct</span> / {p.totalQuestions} Questions
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isDone ? (p.isPassed ? 'Đạt chuẩn' : 'Chưa đạt') : 'Đang làm dở'}
                    </p>
                  </div>

                  {/* Percentage */}
                  <div className="text-center min-w-[70px]">
                    <span className={`text-xl font-black ${
                      Number(p.score) >= 70 ? 'text-emerald-600' : Number(p.score) >= 50 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {p.score}%
                    </span>
                    <span className="text-[10px] block text-slate-400 uppercase font-bold">Chính xác</span>
                  </div>

                  {/* Actions (View Details / Review) */}
                  <div className="flex gap-2">
                    {isDone ? (
                      <Link
                        to={`/customer/session/${p.sessionId}/review`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </Link>
                    ) : (
                      <Link
                        to={`/customer/session/${p.sessionId}/handle`}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Tiếp Tục Làm
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

