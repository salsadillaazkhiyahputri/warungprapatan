import { NextRequest, NextResponse } from 'next/server';
import { processBotMessage, clearConversationState } from '@/lib/bot-nlp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, chat_id = '123456789', reset = false } = body;

    if (reset) {
      clearConversationState(String(chat_id));
      return NextResponse.json({ success: true, message: 'State percakapan direset' });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Pesan (message) wajib diisi' }, { status: 400 });
    }

    const result = await processBotMessage(message, String(chat_id));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing bot message:', error);
    return NextResponse.json({
      success: false,
      intent: 'unknown',
      replyText: 'Maaf, terjadi kesalahan saat memproses perintah Anda. Silakan coba kembali.'
    }, { status: 500 });
  }
}
