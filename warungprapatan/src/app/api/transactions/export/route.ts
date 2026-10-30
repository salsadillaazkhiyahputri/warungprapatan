import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/lib/db';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateTime } from '@/lib/export-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const prodIdParam = searchParams.get('productId');
    const typeParam = searchParams.get('type');

    const productId = prodIdParam && prodIdParam !== 'all' ? parseInt(prodIdParam, 10) : undefined;
    const type = typeParam === 'in' || typeParam === 'out' ? typeParam : 'all';

    const transactions = await TransactionService.getHistory({
      startDate,
      endDate,
      productId: isNaN(productId as number) ? undefined : productId,
      type
    });

    const stamp = new Date().toISOString().split('T')[0];

    // 1. Ekspor Format EXCEL (.xlsx)
    if (format === 'excel' || format === 'xlsx') {
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

      const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const filename = `Laporan-Transaksi-Warung-Prapatan-${stamp}.xlsx`;

      return new NextResponse(buf, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    // 2. Ekspor Format PDF (.pdf)
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header Navy Deep
      doc.setFillColor(15, 23, 42); // slate-900 / navy
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
        }
      });

      const pdfArrayBuffer = doc.output('arraybuffer');
      const filename = `Laporan-Transaksi-Warung-Prapatan-${stamp}.pdf`;

      return new NextResponse(Buffer.from(pdfArrayBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    return NextResponse.json({ error: 'Format tidak didukung' }, { status: 400 });
  } catch (error) {
    console.error('Error generating export:', error);
    return NextResponse.json({ error: 'Gagal mengekspor laporan' }, { status: 500 });
  }
}
