'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Truck,
  History,
  LogOut,
  Store,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/login');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      label: 'Produk',
      href: '/produk',
      icon: <Package size={18} />
    },
    {
      label: 'Supplier',
      href: '/supplier',
      icon: <Truck size={18} />
    },
    {
      label: 'Riwayat Transaksi',
      href: '/riwayat',
      icon: <History size={18} />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          width: '256px',
          background: '#1E2C3A',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          transition: 'transform var(--transition-normal)',
          zIndex: 50,
          ...(isMobileOpen ? {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            transform: 'translateX(0)'
          } : {})
        }}
      >
        {/* Brand Header */}
        <div>
          <div
            style={{
              padding: '20px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#17222D'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: '#2A3B4C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Store size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                Warung Prapatan
              </h1>
              <p style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                Sistem Manajemen Stok
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    background: isActive ? '#2A3B4C' : 'transparent',
                    borderLeft: isActive ? '3px solid #60A5FA' : '3px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="nav-link"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <span style={{ color: isActive ? '#FFFFFF' : '#94A3B8', display: 'flex' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {isActive && <ChevronRight size={14} style={{ color: '#94A3B8' }} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div
          style={{
            padding: '16px 12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#17222D'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#1E2C3A',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: '#2A3B4C',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              WP
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Pemilik Toko
              </p>
              <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                Akses Administrator
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              padding: '9px 12px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#F87171',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-sm)',
              transition: 'all var(--transition-fast)'
            }}
            className="logout-btn"
          >
            <LogOut size={15} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .nav-link:not([style*="#2A3B4C"]):hover {
          background: rgba(255, 255, 255, 0.06) !important;
          color: #FFFFFF !important;
        }
        .logout-btn:hover {
          background: #DC2626 !important;
          color: #FFFFFF !important;
          border-color: #DC2626 !important;
        }
      `}</style>
    </>
  );
};
