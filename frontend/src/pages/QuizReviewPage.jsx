import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  ListFilter, 
  X, 
  ArrowLeft,
  Bookmark
} from 'lucide-react';

export const QuizReviewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [resultFilter, setResultFilter] = useState('ALL'); // ALL, MARKED, ANSWERED, INCORRECT

  useEffect(() => {
    api.get(`/customer/session/${sessionId}/review`)
      .then((data) => {
        setReviewData(data);
        setLoading(false);
        // Confetti celebration if passed!
        if (data?.result?.isPassed) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Đang tải kết quả bài thi...</div>;
  }

  if (!reviewData || !reviewData.questions || reviewData.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy dữ liệu kết quả</h2>
        <button
          onClick={() => navigate('/customer/practices')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh sách luyện tập
        </button>
      </div>
    );
  }

  const { result, session, questions } = reviewData;
  const currentQ = questions[currentIdx] || questions[0];
  const totalQ = questions.length;

  const handleNext = () => {
    if (currentIdx < totalQ - 1) setCurrentIdx(currentIdx + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  // Filter questions for the "Review Results" modal
  const getFilteredQuestions = () => {
    if (resultFilter === 'MARKED') {
      return questions.filter((q) => q.isMarked);
    }
    if (resultFilter === 'ANSWERED') {
      return questions.filter((q) => q.selectedOptionId != null);
    }
    if (resultFilter === 'INCORRECT') {
      return questions.filter((q) => !q.isCorrect);
    }
    return questions;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <Link
          to="/customer/practices"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Về danh sách luyện tập
        </Link>
        <span className="text-xs font-bold text-slate-400 font-mono">
          Session ID: #{session?.sessionId}
        </span>
      </div>

      {/* Score Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {session?.testType || 'Quiz'} Review
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.isPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {result.isPassed ? 'PASSED (Đạt Chuẩn)' : 'FAILED (Chưa Đạt)'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Điểm Số: <span className="text-emerald-400">{result.score}%</span>
          </h1>
          <p className="text-xs text-slate-300">
            Ngày nộp bài: {new Date(result.submittedAt).toLocaleString('vi-VN')}
          </p>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-4 gap-3 text-center w-full md:w-auto">
          <div className="p-3 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 block font-semibold">Tổng câu</span>
            <span className="text-lg font-black text-white">{result.totalQuestions}</span>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <span className="text-xs text-emerald-400 block font-semibold">Đúng</span>
            <span className="text-lg font-black text-emerald-400">{result.correctCount}</span>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <span className="text-xs text-red-400 block font-semibold">Sai</span>
            <span className="text-lg font-black text-red-400">{result.incorrectCount}</span>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <span className="text-xs text-amber-400 block font-semibold">Chưa làm</span>
            <span className="text-lg font-black text-amber-400">{result.unansweredCount}</span>
          </div>
        </div>
      </div>

      {/* Main Review Box (Doc Page 8) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        {/* Header: Question sequence + Question ID + Correct status badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-slate-900">
              {currentIdx + 1})
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              currentQ.isCorrect
                ? 'bg-emerald-100 text-emerald-800'
                : currentQ.selectedOptionId == null
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {currentQ.isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {currentQ.isCorrect ? 'Correct Answer' : currentQ.selectedOptionId == null ? 'Unanswered' : 'Incorrect Answer'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentQ.isMarked && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-indigo-600" /> Marked
              </span>
            )}
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Question ID: {currentQ.questionId}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
          {currentQ.content}
        </div>

        {/* Media if present */}
        {currentQ.mediaUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 w-full">
            <img src={currentQ.mediaUrl} alt="Question Media" className="w-full h-full object-contain bg-slate-50" />
          </div>
        )}

        {/* Options with YOUR ANSWER and CORRECT ANSWER indicators (Doc Page 8) */}
        <div className="space-y-3 pt-2">
          {currentQ.options?.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isUserAnswer = currentQ.selectedOptionId === opt.optionId;
            const isCorrectOption = Boolean(opt.isCorrect);

            let borderColor = 'border-slate-200 bg-white';
            let badgeTag = null;

            if (isUserAnswer && isCorrectOption) {
              borderColor = 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500';
              badgeTag = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> YOUR ANSWER (CORRECT)
                </span>
              );
            } else if (isUserAnswer && !isCorrectOption) {
              borderColor = 'border-red-500 bg-red-50/60 ring-1 ring-red-400';
              badgeTag = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> YOUR ANSWER
                </span>
              );
            } else if (isCorrectOption) {
              borderColor = 'border-emerald-500 bg-emerald-50/30';
              badgeTag = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> CORRECT ANSWER
                </span>
              );
            }

            return (
              <div
                key={opt.optionId}
                className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-4 transition ${borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : isUserAnswer
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-sm font-medium text-slate-800 pt-0.5 leading-snug">
                    {opt.optionText}
                  </span>
                </div>

                {badgeTag && <div className="shrink-0">{badgeTag}</div>}
              </div>
            );
          })}
        </div>

        {/* Bottom Footer (Doc Page 8) */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {/* Left: Review Results button */}
          <button
            type="button"
            onClick={() => setIsResultsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <ListFilter className="w-4 h-4" /> Review Results
          </button>

          {/* Right: Explanation button + Next button */}
          <div className="flex items-center gap-2">
            {/* "The Explanation button is available only when the question is attached with un-empty explanation" */}
            {currentQ.explanation && (
              <button
                type="button"
                onClick={() => setIsExplanationModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" /> Explanation
              </button>
            )}

            {currentIdx > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
            )}

            {currentIdx < totalQ - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* POPUP 1: Question Review Explanation Modal (Doc Page 8 & 9) */}
      {isExplanationModalOpen && currentQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Explanation
              </h3>
              <button
                onClick={() => setIsExplanationModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-800 block text-xs">Đáp án đúng:</span>
                <span className="text-slate-800 font-semibold block mt-0.5">
                  {currentQ.options?.find(o => o.isCorrect)?.optionText || 'Xem trong danh sách lựa chọn'}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Giải thích cặn kẽ:
                </span>
                <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <p>Môn học: {session?.exam?.subject?.subjectName || 'Kiến trúc phần mềm'}</p>
                <p>Phân loại: {currentQ.level}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsExplanationModalOpen(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Review Results Modal (Doc Page 8) */}
      {isResultsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Review Results</h3>
                <p className="text-xs text-slate-400">Chọn câu hỏi để xem lại bài làm và lời giải chi tiết</p>
              </div>
              <button
                onClick={() => setIsResultsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs: Marked, Answered, Incorrect, All Questions */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setResultFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                  resultFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                ALL QUESTIONS ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('INCORRECT')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                  resultFilter === 'INCORRECT' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                INCORRECT ({result.incorrectCount})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('ANSWERED')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                  resultFilter === 'ANSWERED' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                ANSWERED ({result.answeredCount})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('MARKED')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                  resultFilter === 'MARKED' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                MARKED ({questions.filter(q => q.isMarked).length})
              </button>
            </div>

            {/* Number grid */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-72 overflow-y-auto">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {getFilteredQuestions().map((q) => {
                  let badge = 'bg-white text-slate-700 border-slate-200';
                  if (q.isCorrect) {
                    badge = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else if (q.selectedOptionId == null) {
                    badge = 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
                  } else {
                    badge = 'bg-red-500 text-white border-red-500 font-bold';
                  }

                  return (
                    <button
                      key={q.questionId}
                      type="button"
                      onClick={() => {
                        const originalIdx = questions.findIndex(item => item.questionId === q.questionId);
                        if (originalIdx !== -1) setCurrentIdx(originalIdx);
                        setIsResultsModalOpen(false);
                      }}
                      className={`h-10 rounded-xl border flex items-center justify-center text-xs transition transform hover:scale-105 ${badge}`}
                    >
                      {q.orderNo}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Đúng</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Sai</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-300 inline-block"></span> Bỏ qua</span>
              </div>
              <button
                type="button"
                onClick={() => setIsResultsModalOpen(false)}
                className="font-bold text-blue-600 hover:underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

