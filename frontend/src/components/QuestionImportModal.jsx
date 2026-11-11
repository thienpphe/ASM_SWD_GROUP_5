import React, { useState } from 'react';
import { api } from '../api/client';
import { Download, Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function QuestionImportModal({ isOpen, onClose, subjects, defaultSubjectId, onSuccess }) {
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectId || (subjects[0]?.subjectId || ''));
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const sampleTemplate = `Question: What is the primary purpose of the MVC architectural pattern?
Level: Medium
Explanation: MVC separates data, presentation, and user interaction logic.
[A] To encrypt network packets
[B*] To separate presentation, data, and user interaction logic
[C] To compile code into bytecode
[D] To manage relational databases

Question: Which SOLID principle states that classes should be open for extension but closed for modification?
Level: Easy
Explanation: The Open/Closed Principle (OCP) ensures system extensibility without modifying existing tested code.
[A] Single Responsibility Principle
[B*] Open/Closed Principle
[C] Liskov Substitution Principle
[D] Dependency Inversion Principle`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleTemplate], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_question_import_template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setRawText(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      setErrorMsg('Vui lòng chọn môn học cần import câu hỏi.');
      return;
    }
    if (!rawText.trim()) {
      setErrorMsg('Vui lòng nhập hoặc tải file chứa nội dung câu hỏi.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResultMsg(null);

    try {
      const res = await api.post(`/testing/questions/import?subjectId=${selectedSubject}`, {
        content: rawText
      });
      if (res.success) {
        setResultMsg(`Import thành công ${res.data} câu hỏi vào hệ thống!`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Lỗi khi import câu hỏi');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Import Ngân hàng Câu hỏi Hàng loạt</h2>
            <p className="text-xs text-slate-500 mt-0.5">Nhập định dạng chuẩn với dấu sao (*) đánh dấu đáp án đúng</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resultMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{resultMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chọn Môn học nhận câu hỏi *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
            <div>
              <p className="text-xs font-bold text-indigo-900">File mẫu định dạng Quiz Questions</p>
              <p className="text-xs text-indigo-700">Tải file mẫu để xem cú pháp import chuẩn.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Tải file mẫu (.txt)
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Dán nội dung câu hỏi hoặc tải file lên:</label>
              <label className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Tải tệp .txt / .csv</span>
                <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows="10"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={sampleTemplate}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Bắt đầu Import
          </button>
        </div>
      </div>
    </div>
  );
}
