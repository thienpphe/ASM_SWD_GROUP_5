import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { 
  Award, 
  Search, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Filter, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SimulationExamsPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    // Load subjects
    api.get('/customer/practices/subjects').then((res) => {
      setSubjects(res || []);
    });

    loadExams();
  }, [selectedSubjectId]);

  const loadExams = () => {
    setLoading(true);
    api.get('/customer/simulation-exams', {
      subjectId: selectedSubjectId || undefined,
      search: search || undefined,
    })
      .then((res) => {
        setExams(res || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadExams();
  };

  const handleTakeExam = async (quizId) => {
    setStartingId(quizId);
    setErr('');
    try {
      const resp = await api.post(`/customer/simulation-exams/${quizId}/start`);
      // Redirect to Quiz Handle page!
      navigate(`/customer/session/${resp.sessionId}/handle`);
    } catch (e) {
      setErr(e.message || 'Không thể bắt đầu kỳ thi');
      setStartingId(null);
    }
  };

  const getLevelBadge = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'easy':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Dễ (Easy)</span>;
      case 'hard':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">Khó (Hard)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Trung Bình (Medium)</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-600" /> Kỳ Thi Mô Phỏng (Simulation Exams)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống đề thi trắc nghiệm bấm giờ thực tế đếm ngược (Countdown Timer) mô phỏng chính xác cấu trúc bài thi tại trường
        </p>
      </div>

      {err && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter by subject */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">Môn học:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full md:w-64 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
          >
            <option value="">Tất cả môn học (All subjects)</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        {/* Search exam name */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên đề thi simulation..."
            className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Simulation Exams Table (Matching Excel columns: id, subject, simulation exam, level, #question, duration, pass rate) */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải danh sách đề thi...</div>
      ) : exams.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy đề thi mô phỏng nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc liên hệ bộ phận hỗ trợ học tập.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4"># ID</th>
                  <th className="py-3.5 px-4">Môn Học (Subject)</th>
                  <th className="py-3.5 px-4">Tên Đề Thi (Simulation Exam)</th>
                  <th className="py-3.5 px-4">Độ Khó (Level)</th>
                  <th className="py-3.5 px-4">Số Câu Hỏi</th>
                  <th className="py-3.5 px-4">Thời Lượng</th>
                  <th className="py-3.5 px-4">Điểm Đạt (Pass Rate)</th>
                  <th className="py-3.5 px-4 text-right">Vào Thi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {exams.map((quiz) => (
                  <tr key={quiz.quizId} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      #{quiz.quizId}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {quiz.subjectName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-900 block text-sm">{quiz.quizName}</span>
                      {quiz.description && (
                        <span className="text-[11px] text-slate-400 block line-clamp-1 max-w-md">{quiz.description}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getLevelBadge(quiz.level)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                      {quiz.totalQuestions} câu
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {quiz.duration} phút
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-bold text-indigo-600">
                      {quiz.passRate}%
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleTakeExam(quiz.quizId)}
                        disabled={startingId === quiz.quizId}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {startingId === quiz.quizId ? 'Đang chuẩn bị...' : 'Làm Bài Thi'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

