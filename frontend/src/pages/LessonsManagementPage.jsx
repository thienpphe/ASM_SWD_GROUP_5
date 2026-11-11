import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  ListOrdered, Plus, ArrowLeft, Search, Edit3, CheckCircle2,
  XCircle, Video, FileText, HelpCircle, Save, X, Loader2, ArrowUp, ArrowDown
} from 'lucide-react';

export default function LessonsManagementPage() {
  const { id } = useParams(); // subjectId
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: id,
    lessonName: '',
    lessonTypeId: 2, // 1: Topic, 2: Lesson, 3: Quiz
    displayOrder: 1,
    videoLink: '',
    htmlContent: '',
    quizId: '',
    status: true
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjRes, lessonsRes, quizzesRes] = await Promise.all([
        api.get(`/courses/subjects/${id}/details`),
        api.get(`/courses/subjects/${id}/lessons`),
        api.get(`/testing/quizzes?subjectId=${id}&size=50`)
      ]);
      if (subjRes.success) setSubject(subjRes.data.subject);
      if (lessonsRes.success) setLessons(lessonsRes.data || []);
      if (quizzesRes.success) setQuizzes(quizzesRes.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setFormData({
      subjectId: id,
      lessonName: '',
      lessonTypeId: 2,
      displayOrder: lessons.length + 1,
      videoLink: '',
      htmlContent: '',
      quizId: '',
      status: true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (les) => {
    setEditingLesson(les);
    setFormData({
      subjectId: id,
      lessonName: les.lessonName || '',
      lessonTypeId: les.lessonType?.settingId || 2,
      displayOrder: les.displayOrder || 1,
      videoLink: les.videoLink || '',
      htmlContent: les.htmlContent || '',
      quizId: les.quiz?.quizId || '',
      status: les.status !== false
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (lessonId) => {
    try {
      const res = await api.patch(`/courses/lessons/${lessonId}/status`);
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
        subjectId: id,
        quizId: formData.quizId ? parseInt(formData.quizId) : null
      };
      let res;
      if (editingLesson) {
        res = await api.put(`/courses/lessons/${editingLesson.lessonId}`, payload);
      } else {
        res = await api.post('/courses/lessons', payload);
      }
      if (res.success) {
        setModalOpen(false);
        fetchData();
      } else {
        setErrorMsg(res.message || 'Lỗi xử lý');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = !search || l.lessonName?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || l.lessonType?.settingId?.toString() === typeFilter;
    return matchesSearch && matchesType;
  });

  const getLessonTypeBadge = (typeId) => {
    if (typeId === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold text-xs">
          Chương / Topic
        </span>
      );
    }
    if (typeId === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold text-xs">
          <HelpCircle className="w-3.5 h-3.5" /> Quiz Test
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs">
        <Video className="w-3.5 h-3.5" /> Bài học (Lesson)
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Link
            to={`/courses/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Chi tiết Môn học
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Quản lý Bài học - {subject?.subjectName}</h1>
              <p className="text-sm text-slate-500">Thiết lập thứ tự bài học, liên kết video và bài kiểm tra trắc nghiệm</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Bài học Mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài học..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả loại bài</option>
            <option value="1">Chương / Chủ đề (Topic)</option>
            <option value="2">Bài học video/lý thuyết (Lesson)</option>
            <option value="3">Bài kiểm tra (Quiz)</option>
          </select>
          <span className="text-xs text-slate-500 font-medium">Tổng: {filteredLessons.length} bài</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ListOrdered className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Chưa có bài học nào</h3>
          <p className="text-sm text-slate-500 mt-1">Bấm "Thêm Bài học Mới" để bắt đầu xây dựng giáo trình.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Thứ tự</th>
                <th className="px-6 py-4">Tên Bài học</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4">Liên kết kèm theo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLessons.map((l) => (
                <tr key={l.lessonId} className={`hover:bg-slate-50/50 ${l.lessonType?.settingId === 1 ? 'bg-slate-50/30 font-semibold' : ''}`}>
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-500">
                    {l.displayOrder}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-900">{l.lessonName}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getLessonTypeBadge(l.lessonType?.settingId)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {l.videoLink && (
                      <span className="inline-flex items-center gap-1 text-indigo-600 mr-2">
                        <Video className="w-3.5 h-3.5" /> Video Link
                      </span>
                    )}
                    {l.quiz && (
                      <span className="inline-flex items-center gap-1 text-purple-600">
                        <HelpCircle className="w-3.5 h-3.5" /> {l.quiz.quizName}
                      </span>
                    )}
                    {!l.videoLink && !l.quiz && !l.htmlContent && '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(l.lessonId)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        l.status !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {l.status !== false ? 'Hoạt động' : 'Đang ẩn'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(l)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLesson ? 'Chỉnh sửa Bài học' : 'Thêm Bài học Mới'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Bài học *</label>
                <input
                  type="text"
                  required
                  value={formData.lessonName}
                  onChange={(e) => setFormData({ ...formData, lessonName: e.target.value })}
                  placeholder="VD: Tổng quan về Microservices Architecture"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phân loại *</label>
                  <select
                    value={formData.lessonTypeId}
                    onChange={(e) => setFormData({ ...formData, lessonTypeId: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value={1}>Chương / Chủ đề (Topic)</option>
                    <option value={2}>Bài giảng video / văn bản (Lesson)</option>
                    <option value={3}>Bài kiểm tra trắc nghiệm (Quiz)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thứ tự hiển thị *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {formData.lessonTypeId === 2 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Video URL (Youtube / Vimeo / MP4)</label>
                    <input
                      type="url"
                      value={formData.videoLink}
                      onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nội dung bài học (HTML / Văn bản)</label>
                    <textarea
                      rows="4"
                      value={formData.htmlContent}
                      onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                      placeholder="Nội dung tóm tắt hoặc tài liệu đọc..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    ></textarea>
                  </div>
                </>
              )}

              {formData.lessonTypeId === 3 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chọn Đề thi Quiz đính kèm *</label>
                  <select
                    value={formData.quizId}
                    onChange={(e) => setFormData({ ...formData, quizId: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="">-- Chọn bài kiểm tra --</option>
                    {quizzes.map((q) => (
                      <option key={q.quizId} value={q.quizId}>{q.quizName} ({q.duration} phút)</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                <select
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="true">Hiển thị (Active)</option>
                  <option value="false">Ẩn (Inactive)</option>
                </select>
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
                  {editingLesson ? 'Lưu thay đổi' : 'Thêm bài học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
