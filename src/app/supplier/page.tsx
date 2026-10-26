'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Modal } from '@/components/ui/Modal';
import { Supplier } from '@/types';
import { formatDateOnly } from '@/lib/export-utils';
import {
  Truck,
  Edit2,
  Info,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2
} from 'lucide-react';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editName, setEditName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditName(supplier.name);
    setErrorMessage('');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    setErrorMessage('');

    if (!editName.trim()) {
      setErrorMessage('Nama supplier tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/suppliers/${selectedSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mengubah nama supplier');
        setIsSaving(false);
        return;
      }

      setIsEditModalOpen(false);
      showToast(`Nama supplier berhasil diperbarui`);
      fetchSuppliers();
    } catch {
      setErrorMessage('Terjadi kesalahan pada server');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Kelola Data Supplier"
      subtitle="Daftar mitra distributor pemasok barang toko"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            background: '#FFFFFF',
            border: '1px solid #1E2C3A',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            color: '#0F172A',
            fontSize: '13.5px',
            fontWeight: 600,
            animation: 'fadeIn 0.18s ease'
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#15803D' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Note Banner */}
      <div className="info-callout">
        <Info size={16} style={{ color: '#1E2C3A', flexShrink: 0, marginTop: '2px' }} />
        <span>
          Mitra supplier otomatis tercatat saat pencatatan transaksi masuk melalui Telegram Bot. Anda dapat memperbarui nama supplier jika diperlukan penyesuaian.
        </span>
      </div>

      {/* Header Counter & Refresh */}
      <div className="page-header-box" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E2C3A',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Total <strong style={{ color: '#1E2C3A' }}>{suppliers.length}</strong> Supplier Terdaftar
          </div>

          <button
            onClick={fetchSuppliers}
            className="btn btn-secondary btn-sm"
            title="Segarkan Data"
          >
            <RefreshCw size={14} className={isLoading ? 'pulse' : ''} />
          </button>
        </div>
      </div>

      {/* Tabel Data Supplier */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Nama Supplier</th>
              <th style={{ width: '35%' }}>Terdaftar Sejak</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  Memuat data supplier...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  <Building2 size={32} style={{ color: '#94A3B8', margin: '0 auto 8px', display: 'block' }} />
                  <span>Belum ada supplier yang tercatat.</span>
                </td>
              </tr>
            ) : (
              suppliers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#1E2C3A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Truck size={16} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#1E2C3A', fontSize: '14px' }}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    {formatDateOnly(item.created_at)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12.5px', height: '32px', padding: '0 12px' }}
                      title="Ubah Nama Supplier"
                    >
                      <Edit2 size={13} />
                      <span>Ubah Nama</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Nama Supplier */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ubah Nama Supplier"
        maxWidth="440px"
      >
        <form onSubmit={handleEditSubmit}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-sm)',
                color: '#DC2626',
                fontSize: '13px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Supplier *</label>
            <input
              type="text"
              className="form-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Contoh: PT Unilever Indonesia"
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0'
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
