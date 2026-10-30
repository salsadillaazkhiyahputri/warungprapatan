# Panduan Integrasi Telegram Chatbot & n8n (Warung Prapatan)

Dokumen ini menjelaskan tata cara menghubungkan alur kerja otomatisasi n8n yang di-hosting pada platform **Sumopod** dengan **Telegram Bot API**, mesin inferensi **Groq (model Llama)**, serta basis data **Supabase**.

---

## 1. Arsitektur Komunikasi
Sesuai Gambar 1 pada Proposal Capstone 2:
```
Pemilik (Telegram App)
       │
       ▼ (Webhook)
Telegram Bot API
       │
       ▼ (HTTP Webhook)
n8n Workflow Engine (Sumopod Cloud)
       ├── AI Agent (Groq / Llama + Memory Context)
       └── HTTP Request API / Supabase Client
              │
              ▼ (PostgreSQL REST / RPC)
         Supabase DB ◄──► Dashboard Web (Next.js di Vercel)
```

---

## 2. Langkah Konfigurasi n8n

### Langkah A: Import Workflow
1. Buka dashboard instance n8n Anda (misal di `https://n8n.your-domain.sumopod.id`).
2. Masuk ke menu **Workflows** -> Klik tombol **Add Workflow** -> Pilih **Import from File...**
3. Pilih berkas [`n8n/warung_prapatan_workflow.json`](file:///c:/KULIAH/SEMESTER%207_TI%20UMY/CAPSTONE%202/warung-prapatan/n8n/warung_prapatan_workflow.json).

### Langkah B: Kredensial Telegram Bot API
1. Buka aplikasi Telegram dan cari **@BotFather**.
2. Ketik `/newbot`, ikuti petunjuk nama bot (misal: `WarungPrapatanStokBot`).
3. Salin token API bot yang diberikan (contoh: `7123456789:AAH...`).
4. Pada n8n, buat kredensial baru bertipe **Telegram API** dan tempelkan token tersebut.
5. Kaitkan kredensial ini pada node **Telegram Trigger** dan **Kirim Balasan Telegram**.

### Langkah C: Konfigurasi Environment & Endpoint
Node `HTTP Request ke Backend AI Agent` mengarahkan pesan pengguna ke endpoint API:
- URL: `https://your-nextjs-domain.vercel.app/api/bot/chat` (atau `http://localhost:3000/api/bot/chat` untuk lokal)
- Method: `POST`
- Body JSON:
  ```json
  {
    "message": "={{ $json.message.text }}",
    "chat_id": "={{ $json.message.chat.id }}"
  }
  ```

---

## 3. Skenario Uji Percakapan (Sesuai Gambar 23 – 28 Proposal)

| No | Kebutuhan SRS | Contoh Kalimat Uji | Respons yang Dihasilkan |
|---|---|---|---|
| 1 | **F1 & F2**: Stok Masuk dengan Supplier | `masuk 2 karton indomie dari unilever` | Mencatat stok masuk (+80 pcs), mendaftarkan supplier Unilever, mengembalikan stok terkini. |
| 2 | **F3**: Stok Masuk tanpa Supplier | `masuk 5 karton royco` | Bot bertanya balik: *"Dari supplier mana?"*. Setelah dijawab `"unilever"`, transaksi dieksekusi. |
| 3 | **F4**: Stok Keluar | `keluar 3 pcs sabun lifebuoy` | Mengurangi 3 pcs, menyimpan transaksi keluar tanpa supplier, membalas konfirmasi stok baru. |
| 4 | **F5**: Cek Stok | `stok indomie berapa?` | Menampilkan info stok dalam pcs beserta konversi jumlah karton. |
| 5 | **F6**: Rekap Harian | `rekap hari ini` | Merangkum total transaksi masuk dan keluar hari ini beserta rincian nama produk dan supplier. |
| 6 | **F7**: Pesan Tidak Dikenal | `halo apa kabar` | Mengirim panduan otomatis format perintah yang didukung. |

---

## 4. Mode Standalone / Pengujian Tanpa n8n Eksternal
Untuk keperluan demo sidang atau pengujian tanpa dependensi eksternal, aplikasi web Warung Prapatan telah dilengkapi dengan **Telegram Chatbot Live Simulator** pada menu **Chatbot Tester** (`/bot-tester`). Fitur ini menggunakan mesin NLP yang sama persis dan langsung memutasi database.
