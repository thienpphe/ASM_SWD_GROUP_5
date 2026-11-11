import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  Flag, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Bookmark, 
  BookmarkCheck,
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';

export const QuizHandlePage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [currentQuestionNo, setCurrentQuestionNo] = useState(1);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Session info & Timer
  const [testType, setTestType] = useState('Practice'); // Practice or Simulation
  const [timerSeconds, setTimerSeconds] = useState(0); // Count up or Count down
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modals
  const [isPeekModalOpen, setIsPeekModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressFilter, setProgressFilter] = useState('ALL'); // ALL, UNANSWERED, MARKED, ANSWERED
  const [progressData, setProgressData] = useState(null);
  const [isScoreConfirmOpen, setIsScoreConfirmOpen] = useState(false);

  // Load question for current question number
  const loadQuestion = async (qNo) => {
    setLoading(true);
    try {
      const q = await api.get(`/customer/session/${sessionId}/question/${qNo}`);
      setQuestionData(q);
      setCurrentQuestionNo(q.orderNo);
      setSelectedOptionId(q.selectedOptionId);
      setIsMarked(Boolean(q.isMarked));
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    // Load question 1
    loadQuestion(1);

    // Fetch initial progress to get total questions and initial state
    api.get(`/customer/session/${sessionId}/progress`).then((p) => {
      setProgressData(p);
    });
  }, [sessionId]);

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (testType === 'Simulation') {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        } else {
          // Practice counts up!
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, testType]);

  const formatTimer = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Answer selection handler (Immediately saves to backend to avoid data loss on refresh)
  const handleSelectOption = async (optionId) => {
    setSelectedOptionId(optionId);
    try {
      await api.post(`/customer/session/${sessionId}/answer`, {
        questionId: questionData.questionId,
        selectedOptionId: optionId,
        isMarked,
      });
      // Refresh progress
      refreshProgress();
    } catch (e) {
      console.error('Failed to sync answer', e);
    }
  };

  // Toggle Mark for review
  const handleToggleMark = async () => {
    const nextMarked = !isMarked;
    setIsMarked(nextMarked);
    try {
      await api.post(`/customer/session/${sessionId}/answer`, {
        questionId: questionData.questionId,
        selectedOptionId,
        isMarked: nextMarked,
      });
      refreshProgress();
    } catch (e) {
      console.error('Failed to sync mark', e);
    }
  };

  const refreshProgress = async () => {
    try {
      const p = await api.get(`/customer/session/${sessionId}/progress`);
      setProgressData(p);
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (questionData && currentQuestionNo < questionData.totalQuestions) {
      loadQuestion(currentQuestionNo + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionNo > 1) {
      loadQuestion(currentQuestionNo - 1);
    }
  };

  // Review Progress Modal open
  const openProgressModal = async () => {
    await refreshProgress();
    setIsProgressModalOpen(true);
  };

  const jumpToQuestion = (qNo) => {
    setIsProgressModalOpen(false);
    loadQuestion(qNo);
  };

  // Score Exam flow
  const handleScoreExamClick = async () => {
    await refreshProgress();
    setIsScoreConfirmOpen(true);
  };

  const handleAutoSubmit = async () => {
    setIsTimerRunning(false);
    await doFinalSubmit();
  };

  const doFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(`/customer/session/${sessionId}/score`, {});
      setIsScoreConfirmOpen(false);
      // Navigate to Quiz Review page!
      navigate(`/customer/session/${sessionId}/review`);
    } catch (e) {
      alert(e.message || 'Lỗi khi chấm điểm bài thi');
      setIsSubmitting(false);
    }
  };

  const totalQuestions = questionData?.totalQuestions || 10;
  const isFirstQuestion = currentQuestionNo === 1;
  const isLastQuestion = currentQuestionNo === totalQuestions;

  // Filter questions in Progress Modal
  const getFilteredProgressQuestions = () => {
    if (!progressData?.questions) return [];
    if (progressFilter === 'ALL') return progressData.questions;
    return progressData.questions.filter((q) => q.status === progressFilter);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Floating Bar: Question Progress & Timer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              Q
            </span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiến Độ</p>
              <p className="text-base font-extrabold text-slate-900">
                {currentQuestionNo} / {totalQuestions}
              </p>
            </div>
          </div>

          {/* Timer (Doc Page 6: Countdown for simulation, countup for practice) */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-base font-bold shadow-sm">
            <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        {/* Main Quiz Box (Matching Doc Page 5 & 6) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative">
          {loading ? (
            <div className="p-20 text-center text-slate-400">Đang tải câu hỏi...</div>
          ) : questionData ? (
            <div className="p-6 sm:p-10 space-y-6">
              {/* Question Header: Sequence number + Question ID */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-lg font-black text-slate-900">
                  {currentQuestionNo})
                </span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Question ID: {questionData.questionId}
                </span>
              </div>

              {/* Question Content */}
              <div className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                {questionData.content}
              </div>

              {/* Optional Media (Image / Video) */}
              {questionData.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 w-full">
                  <img
                    src={questionData.mediaUrl}
                    alt="Question Media"
                    className="w-full h-full object-contain bg-slate-50"
                  />
                </div>
              )}

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-2">
                {questionData.options?.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOptionId === opt.optionId;

                  return (
                    <label
                      key={opt.optionId}
                      onClick={() => handleSelectOption(opt.optionId)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm shadow-blue-500/10'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {letter}
                      </div>

                      <div className="text-sm font-medium text-slate-800 pt-0.5 leading-snug">
                        {opt.optionText}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Action Bar Above Footer: Peek at Answer & Mark for Review */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {/* Peek at Answer button (Only available for Practice quiz, NOT Simulation exam) */}
                {questionData.peekCorrectAnswer !== undefined && (
                  <button
                    type="button"
                    onClick={() => setIsPeekModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Peek at Answer
                  </button>
                )}

                {/* Mark for Review Checkbox */}
                <button
                  type="button"
                  onClick={handleToggleMark}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isMarked
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isMarked ? 'fill-white' : ''}`} />
                  Mark for Review
                </button>
              </div>

              {/* Bottom Footer Navigation Bar (Doc Page 6 & 7) */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {/* Left: Review Progress button */}
                <button
                  type="button"
                  onClick={openProgressModal}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
                >
                  Review Progress
                </button>

                {/* Right Navigation buttons:
                    First question: Next only
                    Middle question: Previous & Next
                    Last question: Previous & Score Exam */}
                <div className="flex items-center gap-2">
                  {!isFirstQuestion && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}

                  {!isLastQuestion ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleScoreExamClick}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" /> Score Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* POPUP 1: Peek at Answer (Doc Page 6) */}
      {isPeekModalOpen && questionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" /> Peek at Answer
              </h3>
              <button
                onClick={() => setIsPeekModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-800 block text-sm">
                  Đáp án đúng:
                </span>
                <span className="text-slate-800 font-semibold mt-1 block">
                  {questionData.peekCorrectAnswer}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Giải thích chi tiết:
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                  {questionData.peekExplanation || 'Không có giải thích chi tiết cho câu hỏi này.'}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                <p>Khóa học: SWD392 Architecture Prep</p>
                <p>Độ khó: {questionData.level}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPeekModalOpen(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Review Progress Grid (Doc Page 6 & 7) */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Review Progress</h3>
                <p className="text-xs text-slate-400">Xem tiến độ làm bài trước khi nộp điểm</p>
              </div>
              <button
                onClick={() => setIsProgressModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Buttons: UnAnswered, Marked, Answered, All Questions + Score Exam Now */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setProgressFilter('UNANSWERED')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    progressFilter === 'UNANSWERED' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  UNANSWERED ({progressData?.unansweredCount || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setProgressFilter('MARKED')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    progressFilter === 'MARKED' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  MARKED ({progressData?.markedCount || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setProgressFilter('ANSWERED')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    progressFilter === 'ANSWERED' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  ANSWERED ({progressData?.answeredCount || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setProgressFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    progressFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  ALL QUESTIONS ({progressData?.totalQuestions || 0})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProgressModalOpen(false);
                  setIsScoreConfirmOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                SCORE EXAM NOW
              </button>
            </div>

            {/* Question Number Grid */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-72 overflow-y-auto">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {getFilteredProgressQuestions().map((q) => {
                  let badgeColor = 'bg-white text-slate-700 border-slate-200';
                  if (q.status === 'MARKED') {
                    badgeColor = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                  } else if (q.status === 'ANSWERED') {
                    badgeColor = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else {
                    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-medium';
                  }

                  return (
                    <button
                      key={q.questionId}
                      type="button"
                      onClick={() => jumpToQuestion(q.orderNo)}
                      className={`h-10 rounded-xl border flex items-center justify-center text-xs transition transform hover:scale-105 ${badgeColor}`}
                    >
                      {q.orderNo}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Bấm vào số câu để chuyển đến câu hỏi đó</span>
              <button
                type="button"
                onClick={() => setIsProgressModalOpen(false)}
                className="font-bold text-blue-600 hover:underline"
              >
                Tiếp Tục Làm Bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: Score Exam Confirmation (Doc Page 7) */}
      {isScoreConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden p-6 sm:p-8 space-y-5 text-center">
            {progressData?.answeredCount === 0 ? (
              /* Case 1: 0 questions answered */
              <>
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Exit Exam?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have not answered any questions. By clicking on the [Exit Exam] button below, you will complete your current exam and be returned to the dashboard.
                </p>
                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsScoreConfirmOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    -- Back
                  </button>
                  <button
                    type="button"
                    onClick={doFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Exiting...' : 'Exit Exam'}
                  </button>
                </div>
              </>
            ) : progressData?.unansweredCount > 0 ? (
              /* Case 2: Some unanswered questions */
              <>
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Score Exam?</h3>
                <p className="text-sm font-extrabold text-amber-600">
                  {progressData.answeredCount} of {progressData.totalQuestions} Questions Answered
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By clicking on the [Score Exam] button below, you will complete your current exam and receive your score. You will not be able to change any answers after this point.
                </p>
                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsScoreConfirmOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    -- Back
                  </button>
                  <button
                    type="button"
                    onClick={doFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scoring...' : 'Score Exam'}
                  </button>
                </div>
              </>
            ) : (
              /* Case 3: All questions answered */
              <>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Score Exam?</h3>
                <p className="text-sm font-extrabold text-emerald-600">
                  All {progressData?.totalQuestions} Questions Answered!
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By clicking on the [Score Exam] button below, you will complete your current exam and receive your score.
                </p>
                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsScoreConfirmOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    -- Back
                  </button>
                  <button
                    type="button"
                    onClick={doFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scoring...' : 'Score Exam'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

