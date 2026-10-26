'use client';

import React from 'react';
import { Menu, Calendar } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  title,
  subtitle
}) => {
  const [todayFormatted, setTodayFormatted] = React.useState('');

  React.useEffect(() => {
    setTodayFormatted(
      new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date())
    );
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onToggleMobileMenu}
          style={{
            display: 'none',
            color: '#1E2C3A',
            padding: '7px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #E2E8F0',
            background: '#FFFFFF'
          }}
          className="mobile-toggle-btn"
          title="Buka Menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2C3A', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontSize: '12.5px',
            fontWeight: 500,
            color: '#475569'
          }}
        >
          <Calendar size={14} style={{ color: '#64748B' }} />
          <span>{todayFormatted || 'Senin, 26 Oktober 2026'}</span>
        </div>
      </div>
    </header>
  );
};
