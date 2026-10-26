import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  isAlert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  isAlert = false
}) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${isAlert ? '#FECACA' : '#E2E8F0'}`,
        borderRadius: 'var(--radius-md)',
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)',
        transition: 'all var(--transition-fast)'
      }}
      className="stat-card"
    >
      <div>
        <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
          {title}
        </p>
        <h3
          style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: isAlert ? '#DC2626' : '#1E2C3A',
            lineHeight: 1.1
          }}
        >
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-sm)',
          background: isAlert ? '#FEF2F2' : '#F8FAFC',
          color: isAlert ? '#DC2626' : '#1E2C3A',
          border: `1px solid ${isAlert ? '#FECACA' : '#E2E8F0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </div>

      <style jsx>{`
        .stat-card:hover {
          border-color: ${isAlert ? '#FCA5A5' : '#CBD5E1'};
        }
      `}</style>
    </div>
  );
};
