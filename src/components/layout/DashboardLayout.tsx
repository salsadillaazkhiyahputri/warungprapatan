'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifikasi autentikasi pengguna
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/login');
        } else {
          setIsLoadingAuth(false);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  if (isLoadingAuth) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-main)',
          color: 'var(--text-secondary)',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--border-light)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <p style={{ fontSize: '14px' }}>Memuat sistem Warung Prapatan...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-content">
        <Header
          onToggleMobileMenu={() => setIsMobileOpen(prev => !prev)}
          title={title}
          subtitle={subtitle}
        />

        <main className="page-wrapper animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: flex !important;
          }
          .date-pill {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
