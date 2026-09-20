'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVip } from '@/context/VipContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const { activateVip, deactivateVip } = useVip();

  // Load saved session on mount
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('tunegrab_active_user_id');
      if (savedUserId) {
        fetch(`/api/auth/me?userId=${encodeURIComponent(savedUserId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.user) {
              setUser(data.user);
              if (data.user.isVip && data.user.vipKey) {
                activateVip(data.user.vipKey);
              }
            } else {
              localStorage.removeItem('tunegrab_active_user_id');
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.warn('Could not restore auth session:', e);
    }
  }, []);

  const login = async ({ identifier, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Login failed.');
    }

    setUser(data.user);
    try {
      localStorage.setItem('tunegrab_active_user_id', data.user.userId);
    } catch (e) {}

    if (data.user.isVip && data.user.vipKey) {
      activateVip(data.user.vipKey);
    }

    return data.user;
  };

  const register = async ({ name, email, password }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Registration failed.');
    }

    setUser(data.user);
    try {
      localStorage.setItem('tunegrab_active_user_id', data.user.userId);
    } catch (e) {}

    return data.user;
  };

  const sendOtp = async (email) => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to send OTP code.');
    }
    return data;
  };

  const verifyOtp = async ({ email, code, name }) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, name }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Verification failed.');
    }

    setUser(data.user);
    try {
      localStorage.setItem('tunegrab_active_user_id', data.user.userId);
    } catch (e) {}

    return data.user;
  };

  const loginWithGoogle = async ({ email, name, avatar }) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, avatar }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Google login failed.');
    }

    setUser(data.user);
    try {
      localStorage.setItem('tunegrab_active_user_id', data.user.userId);
    } catch (e) {}

    return data.user;
  };

  const logout = () => {
    setUser(null);
    deactivateVip();
    try {
      localStorage.removeItem('tunegrab_active_user_id');
    } catch (e) {}
  };

  const recordDownload = async (track) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, track }),
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.warn('Could not record download:', e);
    }
  };

  const toggleFavorite = async (track) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    try {
      const res = await fetch('/api/auth/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, track }),
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
      }
      return true;
    } catch (e) {
      console.warn('Could not toggle favorite:', e);
      return false;
    }
  };

  const isFavorite = (trackId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some((f) => (f.id && f.id === trackId) || (f.title && f.title === trackId));
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authMode,
        isAuthModalOpen,
        login,
        register,
        sendOtp,
        verifyOtp,
        loginWithGoogle,
        logout,
        recordDownload,
        toggleFavorite,
        isFavorite,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
