import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Global modals
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [subjectRegisterState, setSubjectRegisterState] = useState({ isOpen: false, subject: null, selectedPackage: null });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    const userInfo = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      avatarUrl: data.avatarUrl,
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setAuthModalState({ isOpen: false, tab: 'login' });
    return userInfo;
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    setToken(data.token);
    const userInfo = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      avatarUrl: data.avatarUrl,
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setAuthModalState({ isOpen: false, tab: 'login' });
    return userInfo;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    const updated = await api.put('/auth/profile', profileData);
    const userInfo = {
      ...user,
      fullName: updated.fullName,
      mobile: updated.mobile,
      gender: updated.gender,
      address: updated.address,
      avatarUrl: updated.avatarUrl,
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setIsProfileModalOpen(false);
    return updated;
  };

  const changePassword = async (oldPassword, newPassword) => {
    await api.post('/auth/change-password', {
      currentPassword: oldPassword,
      newPassword: newPassword,
    });
    setIsChangePasswordModalOpen(false);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalState({ isOpen: true, tab });
  };

  const closeAuthModal = () => {
    setAuthModalState({ isOpen: false, tab: 'login' });
  };

  const openSubjectRegisterModal = (subject = null, selectedPackage = null) => {
    setSubjectRegisterState({ isOpen: true, subject, selectedPackage });
  };

  const closeSubjectRegisterModal = () => {
    setSubjectRegisterState({ isOpen: false, subject: null, selectedPackage: null });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    authModalState,
    openAuthModal,
    closeAuthModal,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    subjectRegisterState,
    openSubjectRegisterModal,
    closeSubjectRegisterModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

