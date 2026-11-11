import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Layers, ArrowLeft, Grid, Plus, Edit3, Trash2, Save,
  Clock, CheckCircle2, AlertCircle, Loader2, X
} from 'lucide-react';

export default function QuizDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [matrixRules, setMatrixRules] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'info'

  // Overview form
  const [overviewForm, setOverviewForm] = useState({
    quizName: '',
    testType: 'Simulation',
    level: 'Medium',
    duration: 60,
    passRate: 70,
    totalQuestions: 10,
    description: '',
    status: 'Published'
  });
  const [savingOverview, setSavingOverview] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Matrix Rule Modal
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    dimensionId: '',
    questionLevel: 'Any',
    numberOfQuestions: 1
  });

  const fetchQuizDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/testing/quizzes/${id}`);
      if (res.success) {
        const data = res.data;
        setQuiz(data.quiz);
        setMatrixRules(data.matrixRules || []);

        const q = data.quiz;
        setOverviewForm({
          quizName: q.quizName || '',
          testType: q.testType || 'Simulation',
          level: q.level || 'Medium',
          duration: q.duration || 60,
          passRate: q.passRate || 70,
          totalQuestions: q.totalQuestions || 10,
          description: q.description || '',
          status: q.status || 'Published'
        });

        // Also fetch subject dimensions
        if (q.subject?.subjectId) {
          const dimRes = await api.get(`/courses/subjects/${q.subject.subjectId}/dimensions`);
          if (dimRes.success) setDimensions(dimRes.data || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  // Save Overview
  const handleSaveOverview = async (e) => {
    e.preventDefault();
    setSavingOverview(true);
    setStatusMsg('');
    try {
      const payload = {
        ...overviewForm,
        subjectId: quiz.subject.subjectId,
        matrixRules: matrixRules.map(r => ({
          dimensionId: r.dimension?.dimensionId,
          lessonId: r.lesson?.lessonId,
          questionLevel: r.questionLevel,
          numberOfQuestions: r.numberOfQuestions
        }))
      };

      const res = await api.put(`/testing/quizzes/${id}`, payload);
      if (res.success) {
        setStatusMsg('Cập nhật thông tin bài thi thành công!');
        fetchQuizDetails();
      } else {
        setStatusMsg('Lỗi: ' + res.message);
      }
    } catch (err) {
      setStatusMsg('Lỗi: ' + err.message);
    } finally {
      setSavingOverview(false);
    }
  };

  // Add Matrix Rule
  const handleOpenAddRule = () => {
    setRuleForm({
      dimensionId: dimensions[0]?.dimensionId || '',
      questionLevel: 'Any',
      numberOfQuestions: 1
    });
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    try {
      const newRule = {
        dimensionId: parseInt(ruleForm.dimensionId),
        questionLevel: ruleForm.questionLevel,
        numberOfQuestions: parseInt(ruleForm.numberOfQuestions)
      };

      const currentRules = matrixRules.map(r => ({
        dimensionId: r.dimension?.dimensionId,
        lessonId: r.lesson?.lessonId,
        questionLevel: r.questionLevel,
        numberOfQuestions: r.numberOfQuestions
      }));

      const updatedRules = [...currentRules, newRule];

      const payload = {
        ...overviewForm,
        subjectId: quiz.subject.subjectId,
        matrixRules: updatedRules
      };

      const res = await api.put(`/testing/quizzes/${id}`, payload);
      if (res.success) {
        setRuleModalOpen(false);
        fetchQuizDetails();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRule = async (index) => {
    try {
      const updatedRules = matrixRules
        .filter((_, idx) => idx !== index)
        .map(r => ({
          dimensionId: r.dimension?.dimensionId,
          lessonId: r.lesson?.lessonId,
          questionLevel: r.questionLevel,
          numberOfQuestions: r.numberOfQuestions
        }));

      const payload = {
        ...overviewForm,
        subjectId: quiz.subject.subjectId,
        matrixRules: updatedRules
      };

      const res = await api.put(`/testing/quizzes/${id}`, payload);
      if (res.success) {
        fetchQuizDetails();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const totalQuestionsInMatrix = matrixRules.reduce((acc, r) => acc + (r.numberOfQuestions || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Danh sách Đề thi
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{quiz?.quizName}</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
              {quiz?.testType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Môn học:</span>
          <span className="text-xs font-bold text-slate-800">{quiz?.subject?.subjectName}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-5 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          Ma trận Câu hỏi & Tỷ lệ ({matrixRules.length} quy tắc)
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-5 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'info'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Cấu hình Thông tin Đề thi
        </button>
      </div>

      {/* TAB 1: MATRIX RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-indigo-950">Ma trận Đề thi (Quiz Matrix)</p>
              <p className="text-xs text-indigo-700 mt-0.5">
                Khi sinh đề ngẫu nhiên, hệ thống sẽ bốc câu hỏi từ các chiều kiến thức theo số lượng cấu hình dưới đây.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-900 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-xs">
                Tổng câu ma trận: {totalQuestionsInMatrix} / {quiz?.totalQuestions}
              </span>
              <button
                onClick={handleOpenAddRule}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm Quy tắc Ma trận
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Dimension (Chiều kiến thức)</th>
                  <th className="px-6 py-4">Mức độ câu hỏi</th>
                  <th className="px-6 py-4">Số lượng câu</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixRules.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-400">
                      Chưa có quy tắc ma trận nào. Hệ thống sẽ bốc ngẫu nhiên từ toàn bộ câu hỏi môn học.
                    </td>
                  </tr>
                ) : (
                  matrixRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {rule.dimension?.dimensionName || 'Mặc định'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          {rule.questionLevel || 'Any'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">
                        {rule.numberOfQuestions} câu
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteRule(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa quy tắc"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW FORM */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {statusMsg && (
            <div className={`p-4 rounded-xl text-sm mb-6 ${statusMsg.includes('Lỗi') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSaveOverview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Đề thi *</label>
                <input
                  type="text"
                  required
                  value={overviewForm.quizName}
                  onChange={(e) => setOverviewForm({ ...overviewForm, quizName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phân loại *</label>
                <select
                  value={overviewForm.testType}
                  onChange={(e) => setOverviewForm({ ...overviewForm, testType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="Simulation">Thi mô phỏng (Simulation)</option>
                  <option value="Practice">Luyện tập (Practice)</option>
                  <option value="Lesson Quiz">Bài kiểm tra bài học</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thời lượng (Phút) *</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={overviewForm.duration}
                  onChange={(e) => setOverviewForm({ ...overviewForm, duration: parseInt(e.target.value) || 60 })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tỷ lệ điểm đạt (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={overviewForm.passRate}
                  onChange={(e) => setOverviewForm({ ...overviewForm, passRate: parseFloat(e.target.value) || 70 })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả và quy định làm bài</label>
              <textarea
                rows="4"
                value={overviewForm.description}
                onChange={(e) => setOverviewForm({ ...overviewForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingOverview}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm disabled:opacity-50"
              >
                {savingOverview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu Thay đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Matrix Rule */}
      {ruleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Thêm Quy tắc Ma trận</h2>
              <button
                onClick={() => setRuleModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chọn Dimension (Kích thước) *</label>
                <select
                  value={ruleForm.dimensionId}
                  onChange={(e) => setRuleForm({ ...ruleForm, dimensionId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  {dimensions.map((d) => (
                    <option key={d.dimensionId} value={d.dimensionId}>{d.dimensionName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mức độ câu hỏi *</label>
                <select
                  value={ruleForm.questionLevel}
                  onChange={(e) => setRuleForm({ ...ruleForm, questionLevel: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="Any">Bất kỳ mức độ nào</option>
                  <option value="Easy">Dễ (Easy)</option>
                  <option value="Medium">Trung bình (Medium)</option>
                  <option value="Hard">Khó (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Số lượng câu cần bốc *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={ruleForm.numberOfQuestions}
                  onChange={(e) => setRuleForm({ ...ruleForm, numberOfQuestions: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRuleModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Quy tắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
