import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Sliders, Plus, Search, Filter, Edit3, CheckCircle2, XCircle,
  Settings, Loader2, Save, X
} from 'lucide-react';

export default function SettingsManagementPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [formData, setFormData] = useState({
    settingType: '1',
    settingKey: '',
    settingValue: '',
    description: '',
    displayOrder: 1,
    status: 'Active'
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType) params.append('type', selectedType);
      if (selectedStatus) params.append('status', selectedStatus);
      if (search) params.append('search', search);

      const res = await api.get(`/admin/settings?${params.toString()}`);
      if (res.success) {
        setSettings(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [selectedType, selectedStatus, search]);

  const handleOpenAdd = () => {
    setEditingSetting(null);
    setFormData({
      settingType: selectedType || '3', // Default Subject Category
      settingKey: '',
      settingValue: '',
      description: '',
      displayOrder: settings.length + 1,
      status: 'Active'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSetting(s);
    setFormData({
      settingType: s.settingType?.toString() || '1',
      settingKey: s.settingKey || '',
      settingValue: s.settingValue || '',
      description: s.description || '',
      displayOrder: s.displayOrder || 1,
      status: s.status || 'Active'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/settings/${id}/status`);
      if (res.success) {
        fetchSettings();
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
        settingType: parseInt(formData.settingType),
        displayOrder: parseInt(formData.displayOrder)
      };

      let res;
      if (editingSetting) {
        res = await api.put(`/admin/settings/${editingSetting.settingId}`, payload);
      } else {
        res = await api.post('/admin/settings', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchSettings();
      } else {
        setErrorMsg(res.message || 'Lỗi khi lưu cấu hình');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi hệ thống');
    } finally {
      setSaving(false);
    }
  };

  const getTypeName = (typeId) => {
    switch (parseInt(typeId)) {
      case 1: return 'Vai trò (Role)';
      case 2: return 'Kích thước (Dimension Type)';
      case 3: return 'Danh mục Môn học (Subject Category)';
      case 4: return 'Danh mục Bài viết (Blog Category)';
      case 5: return 'Loại bài học (Lesson Type)';
      case 6: return 'Loại bài thi (Test Type)';
      case 7: return 'Mức độ câu hỏi (Question Level)';
      default: return `Loại #${typeId}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Cấu hình Hệ thống (System Settings)</h1>
              <p className="text-sm text-slate-500">Quản lý các loại từ điển hệ thống, danh mục, loại câu hỏi và quy tắc hiển thị</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Cấu hình Mới
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Key hoặc Giá trị..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả loại cấu hình</option>
            <option value="1">1 - Vai trò (Role)</option>
            <option value="2">2 - Dimension Type</option>
            <option value="3">3 - Subject Category</option>
            <option value="4">4 - Blog Category</option>
            <option value="5">5 - Lesson Type</option>
            <option value="6">6 - Test Type</option>
            <option value="7">7 - Question Level</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động (Active)</option>
            <option value="Inactive">Ngừng kích hoạt (Inactive)</option>
          </select>

          <span className="text-xs text-slate-500 font-medium">Tổng: {settings.length} bản ghi</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : settings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Settings className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Không tìm thấy cấu hình nào</h3>
          <p className="text-sm text-slate-500 mt-1">Hãy thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Nhóm Cấu hình</th>
                <th className="px-6 py-4">Setting Key</th>
                <th className="px-6 py-4">Giá trị (Value)</th>
                <th className="px-6 py-4">Thứ tự</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.map((s) => (
                <tr key={s.settingId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    #{s.settingId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {getTypeName(s.settingType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {s.settingKey}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {s.settingValue}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {s.displayOrder}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(s.settingId)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        s.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s.status === 'Active' ? 'Hoạt động' : 'Đã ẩn'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingSetting ? 'Chỉnh sửa Cấu hình' : 'Thêm Cấu hình Mới'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Loại cấu hình *</label>
                <select
                  value={formData.settingType}
                  onChange={(e) => setFormData({ ...formData, settingType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="1">1 - Vai trò (Role)</option>
                  <option value="2">2 - Dimension Type</option>
                  <option value="3">3 - Subject Category</option>
                  <option value="4">4 - Blog Category</option>
                  <option value="5">5 - Lesson Type</option>
                  <option value="6">6 - Test Type</option>
                  <option value="7">7 - Question Level</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Setting Key *</label>
                <input
                  type="text"
                  required
                  value={formData.settingKey}
                  onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })}
                  placeholder="VD: FRONTEND, BACKEND, CLOUD"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giá trị hiển thị (Value) *</label>
                <input
                  type="text"
                  required
                  value={formData.settingValue}
                  onChange={(e) => setFormData({ ...formData, settingValue: e.target.value })}
                  placeholder="VD: Lập trình Giao diện Web, Điện toán Đám mây"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Active">Hoạt động (Active)</option>
                    <option value="Inactive">Ngừng áp dụng (Inactive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả cấu hình</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi chú thêm về mục cấu hình này..."
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
                  {editingSetting ? 'Lưu Thay đổi' : 'Thêm Cấu hình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
