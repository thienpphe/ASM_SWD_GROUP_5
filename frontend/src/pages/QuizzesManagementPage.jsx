import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Layers, Plus, Search, Filter, Edit3, Trash2, Clock, CheckCircle2,
  AlertCircle, Loader2, Save, X, Grid, BookOpen
} from 'lucide-react';

export default function QuizzesManagementPage() {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';

  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    quizName: '',
    testType: 'Simulation',
    level: 'Medium',
    duration: 60,
    passRate: 70,
    totalQuestions: 10,
    description: '',
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/courses/subjects');
        if (res.success) {
          setSubjects(res.data || []);
          if (!selectedSubject && res.data?.length > 0) {
            setSelectedSubject(res.data[0].subjectId.toString());
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch Quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject) params.append('subjectId', selectedSubject);
      if (selectedType) params.append('testType', selectedType);
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('size', '10');

      const res = await api.get(`/testing/quizzes?${params.toString()}`);
      if (res.success) {
        setQuizzes(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedSubject, selectedType, search, page]);

  const handleOpenAdd = () => {
    setEditingQuiz(null);
    setFormData({
      subjectId: selectedSubject || (subjects[0]?.subjectId || ''),
      quizName: '',
      testType: 'Simulation',
      level: 'Medium',
      duration: 60,
      passRate: 70,
      totalQuestions: 10,
      description: '',
      status: 'Published'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuiz(q);
    setFormData({
      subjectId: q.subject?.subjectId || selectedSubject,
      quizName: q.quizName || '',
      testType: q.testType || 'Simulation',
      level: q.level || 'Medium',
      duration: q.duration || 60,
      passRate: q.passRate || 70,
      totalQuestions: q.totalQuestions || 10,
      description: q.description || '',
      status: q.status || 'Published'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài thi này? Nếu đã có học viên làm bài thi này, hệ thống sẽ từ chối xóa.')) {
      return;
    }
    try {
      const res = await api.delete(`/testing/quizzes/${quizId}`);
      if (res.success) {
        fetchQuizzes();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
        subjectId: parseInt(formData.subjectId),
        duration: parseInt(formData.duration),
        passRate: parseFloat(formData.passRate),
        totalQuestions: parseInt(formData.totalQuestions)
      };

      let res;
      if (editingQuiz) {
        res = await api.put(`/testing/quizzes/${editingQuiz.quizId}`, payload);
      } else {
        res = await api.post('/testing/quizzes', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchQuizzes();
      } else {
        setErrorMsg(res.message || 'Lỗi khi lưu bài thi');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi hệ thống');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Quản lý Đề thi & Bài kiểm tra</h1>
              <p className="text-sm text-slate-500">Tạo đề thi mô phỏng, bài kiểm tra chương và cấu hình ma trận đề thi</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Đề thi Mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài thi..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setPage(0); }}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setPage(0); }}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả loại bài thi</option>
            <option value="Simulation">Thi mô phỏng (Simulation)</option>
            <option value="Practice">Luyện tập (Practice)</option>
            <option value="Lesson Quiz">Bài kiểm tra bài học</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Không tìm thấy bài thi nào</h3>
          <p className="text-sm text-slate-500 mt-1">Hãy thử đổi bộ lọc hoặc thêm đề thi mới.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Tên Đề thi</th>
                <th className="px-6 py-4">Môn học</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Điểm đạt</th>
                <th className="px-6 py-4">Số câu</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizzes.map((q) => (
                <tr key={q.quizId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      to={`/quizzes/${q.quizId}`}
                      className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                    >
                      {q.quizName}
                    </Link>
                    <span className="text-xs text-slate-400 font-mono">#{q.quizId}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {q.subject?.subjectName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        q.testType === 'Simulation'
                          ? 'bg-purple-50 text-purple-700'
                          : q.testType === 'Practice'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {q.testType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {q.duration} phút
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-700">
                    {q.passRate}%
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {q.totalQuestions} câu
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/quizzes/${q.quizId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        title="Ma trận Đề thi"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        Ma trận
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.quizId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa đề thi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Quiz Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingQuiz ? 'Chỉnh sửa Đề thi' : 'Thêm Đề thi Mới'}
              </h2>
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

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Đề thi *</label>
                <input
                  type="text"
                  required
                  value={formData.quizName}
                  onChange={(e) => setFormData({ ...formData, quizName: e.target.value })}
                  placeholder="VD: Final Exam Simulation - Software Architecture"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Môn học *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phân loại Đề *</label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Simulation">Thi mô phỏng (Simulation)</option>
                    <option value="Practice">Luyện tập (Practice)</option>
                    <option value="Lesson Quiz">Bài kiểm tra bài học</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thời gian (phút) *</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Điểm đạt (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.passRate}
                    onChange={(e) => setFormData({ ...formData, passRate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tổng số câu *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả bài thi</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Quy định làm bài thi..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingQuiz ? 'Lưu Thay đổi' : 'Tạo Đề thi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
