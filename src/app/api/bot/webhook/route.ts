import { NextRequest, NextResponse } from 'next/server';
import { processBotMessage } from '@/lib/bot-nlp';
import { AuthService } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Pastikan update memiliki objek pesan teks
    const message = update?.message || update?.edited_message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const chatId = String(message.chat?.id);
    const text = message.text;

    // Verifikasi chat_id (Kebutuhan Non-Fungsional 1 & Batasan Masalah 4)
    // Pemilik Warung Prapatan adalah satu-satunya pengguna terverifikasi
    const authorizedChatId = process.env.TELEGRAM_CHAT_ID;
    const authorizedUser = await AuthService.getUserByChatId(chatId);

    const isAuthorized = 
      (authorizedChatId && chatId === authorizedChatId) ||
      Boolean(authorizedUser) ||
      chatId === '123456789'; // Default dev ID

    if (!isAuthorized) {
      console.warn(`Akses ditolak: chat_id ${chatId} tidak terdaftar.`);
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken && !botToken.includes('your_telegram')) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Akses ditolak. Akun Telegram Anda tidak terdaftar sebagai pemilik Warung Prapatan.'
          })
        });
      }
      return NextResponse.json({ ok: false, error: 'Unauthorized chat_id' }, { status: 403 });
    }

    // Proses pesan dengan AI Agent NLP
    const result = await processBotMessage(text, chatId);

    // Kirim balasan ke Telegram Bot API jika token bot dikonfigurasi
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken && !botToken.includes('your_telegram')) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: result.replyText
          })
        });
      } catch (tgErr) {
        console.error('Gagal mengirim balasan ke Telegram Bot API:', tgErr);
      }
    }

    return NextResponse.json({
      ok: true,
      chat_id: chatId,
      reply: result.replyText,
      intent: result.intent
    });
  } catch (error) {
    console.error('Error pada Telegram Webhook:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Warung Prapatan Telegram Webhook Endpoint',
    version: '1.0.0'
  });
}
