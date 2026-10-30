import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types';

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Ekspor data transaksi ke file Excel (.xlsx) dengan Blob eksplisit & file extension terjamin
 */
export function exportTransactionsToExcel(transactions: Transaction[], filename?: string) {
  const stamp = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `Laporan-Transaksi-Warung-Prapatan-${stamp}.xlsx`;

  const rows = transactions.map((t, index) => ({
    'No': index + 1,
    'Tanggal & Waktu': formatDateTime(t.created_at),
    'Nama Produk': t.product?.name || `Produk #${t.product_id}`,
    'Kategori': t.product?.category || '-',
    'Jenis Transaksi': t.type === 'in' ? 'Masuk' : 'Keluar',
    'Jumlah (satuan utama)': `${t.type === 'in' ? '+' : '-'}${t.qty} ${t.product?.unit || 'pcs'}`,
    'Supplier': t.type === 'in' ? (t.supplier?.name || '-') : '—',
    'Catatan': t.note || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Transaksi');

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 26 },
    { wch: 15 },
    { wch: 16 },
    { wch: 14 },
    { wch: 22 },
    { wch: 28 }
  ];

  // Gunakan write array buffer + Blob resmi dengan MIME type Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  triggerBrowserDownload(blob, finalFilename);
}

/**
 * Ekspor data transaksi ke file PDF (.pdf) dengan Blob eksplisit
 */
export function exportTransactionsToPDF(transactions: Transaction[], filename?: string) {
  const stamp = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `Laporan-Transaksi-Warung-Prapatan-${stamp}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Deep Navy
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('WARUNG PRAPATAN', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Laporan Riwayat Transaksi Stok Barang (Masuk & Keluar)', 14, 23);
  doc.text(`Dicetak pada: ${formatDateTime(new Date().toISOString())}`, 14, 29);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.text(`Total Transaksi: ${transactions.length} record`, 14, 43);

  const tableData = transactions.map((t, index) => [
    index + 1,
    formatDateTime(t.created_at),
    t.product?.name || `ID #${t.product_id}`,
    t.type === 'in' ? 'Masuk' : 'Keluar',
    t.type === 'in' ? `+${t.qty} ${t.product?.unit || 'pcs'}` : `-${t.qty} ${t.product?.unit || 'pcs'}`,
    t.type === 'in' ? (t.supplier?.name || '-') : '—',
    t.note || '-'
  ]);

  autoTable(doc, {
    startY: 48,
    head: [['No', 'Tanggal', 'Nama Produk', 'Jenis', 'Jumlah', 'Supplier', 'Catatan']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 32 },
      2: { cellWidth: 42 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'right', cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 'auto' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'Masuk') {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  const pdfBlob = doc.output('blob');
  triggerBrowserDownload(pdfBlob, finalFilename);
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 200);
}
