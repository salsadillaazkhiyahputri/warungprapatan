'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.45)',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 22px',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC'
          }}
        >
          <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#1E2C3A' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              color: '#64748B',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            className="modal-close-btn"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '22px', overflowY: 'auto', background: '#FFFFFF' }}>
          {children}
        </div>
      </div>

      <style jsx global>{`
        .modal-close-btn:hover {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
          border-color: #FECACA !important;
        }
      `}</style>
    </div>
  );
};
