import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import QuestionImportModal from '../components/QuestionImportModal';
import {
  HelpCircle, Plus, Search, Filter, Edit3, Trash2, CheckCircle2,
  XCircle, Upload, Eye, Loader2, Save, X, Layers, Image as ImageIcon
} from 'lucide-react';

export default function QuestionsBankPage() {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Import Modal
  const [importOpen, setImportOpen] = useState(false);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    dimensionId: '',
    lessonId: '',
    content: '',
    level: 'Medium',
    status: 'Published',
    explanation: '',
    mediaUrl: '',
    options: [
      { optionText: '', isCorrect: true, explanation: '' },
      { optionText: '', isCorrect: false, explanation: '' },
      { optionText: '', isCorrect: false, explanation: '' },
      { optionText: '', isCorrect: false, explanation: '' }
    ]
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Initial subjects load
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

  // Fetch dimensions & lessons when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const fetchSubjData = async () => {
        try {
          const [dimRes, lesRes] = await Promise.all([
            api.get(`/courses/subjects/${selectedSubject}/dimensions`),
            api.get(`/courses/subjects/${selectedSubject}/lessons`)
          ]);
          if (dimRes.success) setDimensions(dimRes.data || []);
          if (lesRes.success) setLessons(lesRes.data || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSubjData();
    }
  }, [selectedSubject]);

  // Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject) params.append('subjectId', selectedSubject);
      if (selectedDimension) params.append('dimensionId', selectedDimension);
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedStatus) params.append('status', selectedStatus);
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('size', '10');

      const res = await api.get(`/testing/questions?${params.toString()}`);
      if (res.success) {
        setQuestions(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedSubject, selectedDimension, selectedLevel, selectedStatus, search, page]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      subjectId: selectedSubject || (subjects[0]?.subjectId || ''),
      dimensionId: dimensions[0]?.dimensionId || '',
      lessonId: '',
      content: '',
      level: 'Medium',
      status: 'Published',
      explanation: '',
      mediaUrl: '',
      options: [
        { optionText: '', isCorrect: true, explanation: '' },
        { optionText: '', isCorrect: false, explanation: '' },
        { optionText: '', isCorrect: false, explanation: '' },
        { optionText: '', isCorrect: false, explanation: '' }
      ]
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    const existingOptions = q.options && q.options.length > 0 ? q.options.map(o => ({
      optionText: o.optionText || '',
      isCorrect: o.isCorrect || false,
      explanation: o.explanation || ''
    })) : [
      { optionText: '', isCorrect: true, explanation: '' },
      { optionText: '', isCorrect: false, explanation: '' }
    ];

    setFormData({
      subjectId: q.subject?.subjectId || selectedSubject,
      dimensionId: q.dimension?.dimensionId || '',
      lessonId: q.lesson?.lessonId || '',
      content: q.content || '',
      level: q.level || 'Medium',
      status: q.status || 'Published',
      explanation: q.explanation || '',
      mediaUrl: q.mediaUrl || '',
      options: existingOptions
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOptionCorrectChange = (index) => {
    const updated = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setFormData({ ...formData, options: updated });
  };

  const handleOptionTextChange = (index, text) => {
    const updated = [...formData.options];
    updated[index].optionText = text;
    setFormData({ ...formData, options: updated });
  };

  const handleToggleStatus = async (questionId) => {
    try {
      const res = await api.patch(`/testing/questions/${questionId}/status`);
      if (res.success) {
        fetchQuestions();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      const res = await api.delete(`/testing/questions/${questionId}`);
      if (res.success) {
        fetchQuestions();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.options.some(o => o.isCorrect)) {
      setErrorMsg('Vui lòng chọn ít nhất 1 đáp án đúng');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
        subjectId: parseInt(formData.subjectId),
        dimensionId: formData.dimensionId ? parseInt(formData.dimensionId) : null,
        lessonId: formData.lessonId ? parseInt(formData.lessonId) : null
      };

      let res;
      if (editingQuestion) {
        res = await api.put(`/testing/questions/${editingQuestion.questionId}`, payload);
      } else {
        res = await api.post('/testing/questions', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchQuestions();
      } else {
        setErrorMsg(res.message || 'Lỗi xử lý câu hỏi');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra');
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
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ngân hàng Câu hỏi (Question Bank)</h1>
              <p className="text-sm text-slate-500">Quản lý câu hỏi trắc nghiệm, các chiều kiến thức và import hàng loạt</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            Import Câu hỏi
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Thêm Câu hỏi Mới
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo nội dung câu hỏi..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Subject */}
            <select
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="">Tất cả Môn học</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
              ))}
            </select>

            {/* Dimension */}
            <select
              value={selectedDimension}
              onChange={(e) => { setSelectedDimension(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="">Tất cả Dimension</option>
              {dimensions.map((d) => (
                <option key={d.dimensionId} value={d.dimensionId}>{d.dimensionName}</option>
              ))}
            </select>

            {/* Level */}
            <select
              value={selectedLevel}
              onChange={(e) => { setSelectedLevel(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="">Tất cả Mức độ</option>
              <option value="Easy">Dễ (Easy)</option>
              <option value="Medium">Trung bình (Medium)</option>
              <option value="Hard">Khó (Hard)</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="Published">Đã xuất bản</option>
              <option value="Draft">Bản nháp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Không tìm thấy câu hỏi nào</h3>
          <p className="text-sm text-slate-500 mt-1">Hãy tạo câu hỏi mới hoặc sử dụng tính năng Import.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">Nội dung Câu hỏi</th>
                  <th className="px-6 py-4">Môn học & Dimension</th>
                  <th className="px-6 py-4">Mức độ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.questionId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{q.questionId}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-semibold text-slate-900 line-clamp-2">{q.content}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{q.options?.length || 0} đáp án</span>
                        {q.explanation && <span>• Có lời giải</span>}
                        {q.mediaUrl && <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">{q.subject?.subjectName}</span>
                        <span className="text-slate-500">{q.dimension?.dimensionName || 'Mặc định'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          q.level === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700'
                            : q.level === 'Hard'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {q.level === 'Easy' ? 'Dễ' : q.level === 'Hard' ? 'Khó' : 'Trung bình'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(q.questionId)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          q.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {q.status === 'Published' ? 'Hiển thị' : 'Ẩn (Nháp)'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Chỉnh sửa câu hỏi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.questionId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {/* Import Modal */}
      <QuestionImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        subjects={subjects}
        defaultSubjectId={selectedSubject}
        onSuccess={fetchQuestions}
      />

      {/* Add / Edit Question Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingQuestion ? 'Chỉnh sửa Câu hỏi' : 'Thêm Câu hỏi Mới'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dimension (Kích thước)</label>
                  <select
                    value={formData.dimensionId}
                    onChange={(e) => setFormData({ ...formData, dimensionId: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="">-- Chọn Dimension --</option>
                    {dimensions.map((d) => (
                      <option key={d.dimensionId} value={d.dimensionId}>{d.dimensionName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mức độ *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Easy">Dễ (Easy)</option>
                    <option value="Medium">Trung bình (Medium)</option>
                    <option value="Hard">Khó (Hard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nội dung Câu hỏi *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ảnh đính kèm (URL - Tùy chọn)</label>
                <input
                  type="url"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Danh sách Đáp án (Chọn radio cho đáp án đúng) *
                </label>
                <div className="space-y-3">
                  {formData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        opt.isCorrect
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => handleOptionCorrectChange(idx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="font-bold text-xs text-slate-500 w-5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt.optionText}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`Đáp án ${String.fromCharCode(65 + idx)}...`}
                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giải thích đáp án chi tiết</label>
                <textarea
                  rows="2"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Giải thích tại sao đáp án trên lại chính xác..."
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
                  {editingQuestion ? 'Lưu Thay đổi' : 'Tạo Câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
