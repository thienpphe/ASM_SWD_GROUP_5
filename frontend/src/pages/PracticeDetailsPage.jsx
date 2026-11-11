import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { PlayCircle, ArrowLeft, Layers, BookOpen, AlertCircle, Eye } from 'lucide-react';

export const PracticeDetailsPage = () => {
  const navigate = useNavigate();
  const { practiceId } = useParams(); // If present, read-only mode

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectionType, setSelectionType] = useState('TOPIC'); // TOPIC or DIMENSION
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimensionId, setSelectedDimensionId] = useState('');
  const [level, setLevel] = useState('Medium');

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Is this read-only view of existing practice?
  const isReadOnly = Boolean(practiceId);

  useEffect(() => {
    // Load accessible subjects
    api.get('/customer/practices/subjects').then((res) => {
      setSubjects(res || []);
      if (res && res.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(res[0].subjectId);
      }
    });
  }, []);

  // When subject changes, load its topics (lessons) and dimensions
  useEffect(() => {
    if (selectedSubjectId) {
      api.get(`/courses/subjects/${selectedSubjectId}/lessons`).then((res) => {
        setTopics(res || []);
      });
      api.get(`/courses/subjects/${selectedSubjectId}/dimensions`).then((res) => {
        setDimensions(res || []);
      });
    }
  }, [selectedSubjectId]);

  const handleStartPractice = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      setErr('Vui lòng chọn môn học');
      return;
    }
    setErr('');
    setLoading(true);

    try {
      const resp = await api.post('/customer/practices/create', {
        subjectId: Number(selectedSubjectId),
        topicId: selectionType === 'TOPIC' && selectedTopicId ? Number(selectedTopicId) : null,
        dimensionId: selectionType === 'DIMENSION' && selectedDimensionId ? Number(selectedDimensionId) : null,
        questionCount: Number(questionCount),
        level,
      });

      // Redirect directly to Quiz Handle page!
      navigate(`/customer/session/${resp.sessionId}/handle`);
    } catch (e) {
      setErr(e.message || 'Không thể tạo bài luyện tập');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/customer/practices"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách luyện tập
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isReadOnly ? 'Chi Tiết Bài Luyện Tập (Practice Details)' : 'Tạo Bài Luyện Tập Mới (Practice Details)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isReadOnly 
              ? 'Xem lại cấu hình bài làm của bạn' 
              : 'Tùy chỉnh số lượng câu hỏi và phạm vi ôn tập theo chủ đề hoặc chiều kiến thức'}
          </p>
        </div>

        {err && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleStartPractice} className="space-y-5">
          {/* 1. Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Môn Học (Subject)
            </label>
            <select
              disabled={isReadOnly}
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
            >
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              * Bạn chỉ có thể chọn những môn học mà bạn đã được cấp quyền truy cập.
            </p>
          </div>

          {/* 2. Number of questions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số lượng câu hỏi luyện tập (Number of practicing questions)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              disabled={isReadOnly}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
            />
          </div>

          {/* 3. Questions selected by topic or dimension */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phạm vi chọn câu hỏi (Questions selected by)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                selectionType === 'TOPIC' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="selType"
                  disabled={isReadOnly}
                  checked={selectionType === 'TOPIC'}
                  onChange={() => setSelectionType('TOPIC')}
                  className="text-blue-600"
                />
                <span className="text-xs font-bold">Theo chủ đề (By subject topic)</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                selectionType === 'DIMENSION' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="selType"
                  disabled={isReadOnly}
                  checked={selectionType === 'DIMENSION'}
                  onChange={() => setSelectionType('DIMENSION')}
                  className="text-blue-600"
                />
                <span className="text-xs font-bold">Theo chiều kiến thức (By dimension)</span>
              </label>
            </div>
          </div>

          {/* 4. Question Group dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nhóm câu hỏi (Question group)
            </label>
            {selectionType === 'TOPIC' ? (
              <select
                disabled={isReadOnly}
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
              >
                <option value="">Tất cả bài học & chủ đề (All topics)</option>
                {topics.map((t) => (
                  <option key={t.lessonId} value={t.lessonId}>
                    {t.lessonName}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled={isReadOnly}
                value={selectedDimensionId}
                onChange={(e) => setSelectedDimensionId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
              >
                <option value="">Tất cả các chiều kiến thức (All dimensions)</option>
                {dimensions.map((d) => (
                  <option key={d.dimensionId} value={d.dimensionId}>
                    [{d.dimensionType?.value}] {d.dimensionName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/customer/practices"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </Link>

            {isReadOnly ? (
              <Link
                to={`/customer/session/${practiceId}/review`}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Practice Review
              </Link>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                {loading ? 'Đang tạo phiên làm bài...' : 'Bắt Đầu Luyện Tập (Practice)'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

