# PANDUAN KOLABORASI TIM PENGEMBANGAN (CAPSTONE 2)
## Sistem Informasi Pencatatan Stok Warung Prapatan

Dokumen ini disusun untuk mengatur pembagian tugas, kepemilikan modul, alur branching GitLab, serta standar kualitas kode agar kolaborasi antaranggota tim berjalan sinergis, rapi, dan siap ditinjau oleh dosen pembimbing maupun penguji melalui GitLab kampus.

---

## 1. Identitas Tim & Pembagian Peran

| No | Nama Anggota | NIM | Peran Utama | Tanggung Jawab Modul |
|---|---|---|---|---|
| 1 | **Rizky Pratama Putra** | 20230140005 | *Team Lead & AI Chatbot Specialist* | Integrasi Telegram Bot API, alur otomasi n8n di Sumopod, NLP/AI Agent Llama via Groq, penanganan context memory, dan endpoint webhook (`/api/bot/*`). |
| 2 | **Refky Muhammad Syahrin** | 20230140050 | *Backend & Database Engineer* | Arsitektur skema basis data PostgreSQL/Supabase, trigger pergerakan stok, data access layer (`src/lib/db.ts`), autentikasi sesi ber-hash, serta logika bisnis perputaran stok. |
| 3 | **Salsa Dilla Azkhiyah Putri** | 20230140077 | *Frontend & UI/UX Designer* | Desain antarmuka web Next.js, implementasi Design System Vanilla CSS (Dark Slate), komponen layout interaktif, tabel riwayat, filtering transaksi, dan ekspor dokumen Excel/PDF. |
| 4 | **Mannanta Brilian Citra** | 20230140228 | *QA & System Integration Specialist* | Pengujian fungsional black-box, validasi akurasi penerjemahan input tidak terstruktur AI Agent, simulator bot testing, dan dokumentasi review evaluasi mitra. |

---

## 2. Pemisahan Modul & Kepemilikan Berkas (File Ownership)

Untuk mencegah terjadinya *merge conflict* pada repository GitLab kampus, setiap anggota memegang kepemilikan direktori/modul tertentu:

```
warung-prapatan/
├── n8n/                                ───► [Rizky Pratama Putra]
│   ├── warung_prapatan_workflow.json
│   └── SETUP_GUIDE.md
├── src/
│   ├── lib/
│   │   ├── bot-nlp.ts                  ───► [Rizky Pratama Putra]
│   │   ├── supabase.ts                 ───► [Refky Muhammad Syahrin]
│   │   ├── db.ts                       ───► [Refky Muhammad Syahrin]
│   │   ├── auth.ts                     ───► [Refky Muhammad Syahrin]
│   │   └── export-utils.ts             ───► [Salsa Dilla Azkhiyah Putri]
│   ├── app/api/
│   │   ├── bot/                        ───► [Rizky Pratama Putra]
│   │   ├── auth/                       ───► [Refky Muhammad Syahrin]
│   │   ├── products/                   ───► [Refky Muhammad Syahrin]
│   │   ├── suppliers/                  ───► [Refky Muhammad Syahrin]
│   │   ├── transactions/               ───► [Refky Muhammad Syahrin]
│   │   └── dashboard/                  ───► [Refky Muhammad Syahrin]
│   ├── app/
│   │   ├── globals.css                 ───► [Salsa Dilla Azkhiyah Putri]
│   │   ├── login/                      ───► [Salsa Dilla Azkhiyah Putri]
│   │   ├── dashboard/                  ───► [Salsa Dilla Azkhiyah Putri]
│   │   ├── produk/                     ───► [Salsa Dilla Azkhiyah Putri]
│   │   ├── supplier/                   ───► [Salsa Dilla Azkhiyah Putri]
│   │   ├── riwayat/                    ───► [Salsa Dilla Azkhiyah Putri]
│   │   └── bot-tester/                 ───► [Mannanta Brilian Citra & Salsa Dilla]
│   └── components/                     ───► [Salsa Dilla Azkhiyah Putri]
└── supabase/                           ───► [Refky Muhammad Syahrin]
    ├── schema.sql
    └── seed.sql
```

---

## 3. Strategi Percabangan Git (GitLab Flow)

Repository GitLab kampus menggunakan strategi cabang terstruktur:

1. **`main`**: Cabang produksi yang stabil dan siap didemokan ke dosen pembimbing dan mitra UMKM.
2. **`develop`**: Cabang integrasi tempat seluruh fitur yang telah diuji digabungkan.
3. **`feature/*`**: Cabang pengerjaan fitur mandiri untuk tiap anggota:
   - `feature/chatbot-telegram-n8n` (Rizky)
   - `feature/backend-supabase-api` (Refky)
   - `feature/frontend-dashboard-ui` (Salsa Dilla)
   - `feature/testing-validation-docs` (Mannanta)

### Alur Kerja Kerja Sama:
```bash
# 1. Menarik pembaruan terkini
git checkout develop
git pull origin develop

# 2. Membuat branch fitur sendiri
git checkout -b feature/nama-fitur

# 3. Mengerjakan perubahan dan membuat commit terstruktur
git add .
git commit -m "feat(produk): tambah validasi batas stok menipis pada katalog"

# 4. Push ke GitLab kampus
git push origin feature/nama-fitur
```

---

## 4. Standar Pesan Commit (Conventional Commits)

Gunakan format commit pesan yang seragam:
- `feat(...)`: Penambahan fitur baru (contoh: `feat(api): endpoint ekspor laporan excel`)
- `fix(...)`: Perbaikan bug atau kesalahan (contoh: `fix(bot): penanganan nama supplier multi-kata`)
- `docs(...)`: Pembaruan dokumentasi (contoh: `docs(srs): perbarui panduan setup n8n`)
- `style(...)`: Perubahan tampilan CSS / UI tanpa mengubah logika bisnis
- `refactor(...)`: Restrukturisasi kode tanpa mengubah fungsionalitas

---

## 5. Checklist Review Pengujian Dosen (Dosen Evaluation Readiness)

Sebelum proyek ditinjau oleh Dosen Pembimbing (*Muhammad Abdul Haq, S.Tr.T., M.Eng., Ph.D.*):
- [x] Seluruh kebutuhan fungsional (F1 s/d F15) telah terimplementasi dengan data persisten.
- [x] Chatbot NLP mendukung Bahasa Indonesia sehari-hari dengan penanganan fallback yang ramah.
- [x] Aturan bisnis stok masuk mewajibkan supplier (auto-tanya balik jika kosong).
- [x] Aturan bisnis stok keluar memvalidasi kecukupan stok barang.
- [x] Ekspor laporan berfungsi untuk format Excel (.xlsx) dan PDF (.pdf).
- [x] Halaman Kelola Supplier sesuai Wireframe Gambar 21: penambahan supplier dilakukan otomatis dari chatbot saat stok masuk, dashboard hanya menyediakan aksi Edit untuk memperbaiki nama supplier, serta tidak menyediakan tombol Tambah maupun Hapus demi menjaga integritas riwayat transaksi.
- [x] Skema DDL dan seed data SQL tersedia di direktori `supabase/`.
- [x] Tidak ada kredensial rahasia (token bot / secret key) yang ter-hardcode langsung di kode publik.
