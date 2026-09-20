'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const VipContext = createContext();

export function VipProvider({ children }) {
  const [isVip, setIsVip] = useState(false);
  const [vipKey, setVipKey] = useState('');
  const [vipExpiry, setVipExpiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check localStorage for active VIP license
    try {
      const savedKey = localStorage.getItem('music_downloader_vip_key');
      const savedExpiry = localStorage.getItem('music_downloader_vip_expiry');

      if (savedKey) {
        if (!savedExpiry || parseInt(savedExpiry, 10) > Date.now()) {
          setIsVip(true);
          setVipKey(savedKey);
          setVipExpiry(savedExpiry ? parseInt(savedExpiry, 10) : null);
        } else {
          // Expired
          localStorage.removeItem('music_downloader_vip_key');
          localStorage.removeItem('music_downloader_vip_expiry');
        }
      }
    } catch (e) {
      console.warn('Could not read VIP state from storage:', e);
    }
  }, []);

  const activateVip = (key, durationDays = 30) => {
    const expiry = durationDays ? Date.now() + durationDays * 24 * 60 * 60 * 1000 : null;
    setIsVip(true);
    setVipKey(key);
    setVipExpiry(expiry);

    try {
      localStorage.setItem('music_downloader_vip_key', key);
      if (expiry) {
        localStorage.setItem('music_downloader_vip_expiry', String(expiry));
      } else {
        localStorage.removeItem('music_downloader_vip_expiry');
      }
    } catch (e) {
      console.warn('Could not save VIP to storage:', e);
    }
  };

  const deactivateVip = () => {
    setIsVip(false);
    setVipKey('');
    setVipExpiry(null);
    try {
      localStorage.removeItem('music_downloader_vip_key');
      localStorage.removeItem('music_downloader_vip_expiry');
    } catch (e) {}
  };

  const openVipModal = () => setIsModalOpen(true);
  const closeVipModal = () => setIsModalOpen(false);

  return (
    <VipContext.Provider
      value={{
        isVip,
        vipKey,
        vipExpiry,
        isModalOpen,
        openVipModal,
        closeVipModal,
        activateVip,
        deactivateVip,
      }}
    >
      {children}
    </VipContext.Provider>
  );
}

export function useVip() {
  const context = useContext(VipContext);
  if (!context) {
    throw new Error('useVip must be used within a VipProvider');
  }
  return context;
}
