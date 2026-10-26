'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, RotateCcw, CheckCheck, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const ChatbotSimulator: React.FC<{ onTransactionUpdated?: () => void }> = ({
  onTransactionUpdated
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Halo! Saya AI Bot Warung Prapatan.\nKirimkan pesan natural berbahasa Indonesia untuk mengelola stok:\n\n• "masuk 2 karton indomie dari unilever"\n• "keluar 3 pcs sabun lifebuoy"\n• "stok indomie berapa?"\n• "rekap hari ini"`,
      time: '09:00'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const getCurrentTimeString = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: getCurrentTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsSending(true);

    try {
      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chat_id: '123456789'
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.replyText || 'Pesan diterima.',
        time: getCurrentTimeString()
      };

      setMessages(prev => [...prev, botMsg]);

      if (data.success && onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Gagal terhubung ke AI Agent. Silakan periksa koneksi server.',
          time: getCurrentTimeString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '123456789', reset: true })
      });
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Sesi percakapan direset. Anda dapat memulai perintah stok kembali.',
          time: getCurrentTimeString()
        }
      ]);
    } catch {
      // ignore
    }
  };

  const quickPrompts = [
    { label: 'Stok Masuk (Supplier Ada)', text: 'masuk 2 karton indomie dari unilever' },
    { label: 'Stok Masuk (Tanya Supplier)', text: 'masuk 5 karton royco' },
    { label: 'Otomatis Daftarkan Supplier Baru', text: 'masuk 2 karton indomie dari mitra jaya abadi' },
    { label: 'Stok Keluar', text: 'keluar 3 pcs sabun lifebuoy' },
    { label: 'Cek Stok', text: 'stok indomie berapa?' },
    { label: 'Rekap Harian', text: 'rekap hari ini' },
    { label: 'Pesan Bebas (Fallback)', text: 'halo apa kabar' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '680px',
        maxWidth: '580px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(24px) saturate(190%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        overflow: 'hidden',
        boxShadow: '0 16px 48px -8px rgba(31, 45, 65, 0.14), inset 0 1px 1.5px rgba(255, 255, 255, 1)'
      }}
      className="telegram-simulator"
    >
      {/* Telegram App Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(44, 65, 86, 0.95) 0%, rgba(57, 88, 109, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #39586D 0%, #7F99B2 100%)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15.5px', fontWeight: 800, color: '#FFFFFF' }}>Warung Prapatan Bot</span>
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(255, 255, 255, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                bot
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#D2D7DB', marginTop: '2px', fontWeight: 500 }}>
              Terhubung ke n8n & Groq Llama • Online
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.14)',
            color: '#FFFFFF',
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.15s ease'
          }}
          className="reset-btn"
          title="Reset percakapan bot"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div
        style={{
          padding: '11px 16px',
          background: 'rgba(241, 244, 248, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#2C4156',
            paddingRight: '4px'
          }}
        >
          <Sparkles size={13} style={{ color: '#39586D' }} />
          Skenario:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            disabled={isSending}
            style={{
              padding: '6px 13px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.78)',
              color: '#2C4156',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 6px rgba(31, 45, 65, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)'
            }}
            className="chip-btn"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'transparent'
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div
                style={{
                  maxWidth: '84%',
                  padding: '13px 17px',
                  borderRadius: isUser ? '18px 18px 3px 18px' : '18px 18px 18px 3px',
                  background: isUser
                    ? 'linear-gradient(135deg, rgba(57, 88, 109, 0.92) 0%, rgba(44, 65, 86, 0.92) 100%)'
                    : 'rgba(255, 255, 255, 0.86)',
                  border: isUser
                    ? '1px solid rgba(255, 255, 255, 0.28)'
                    : '1px solid rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: isUser ? '#FFFFFF' : '#1E2D3D',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: isUser
                    ? '0 6px 18px rgba(44, 65, 86, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
                    : '0 4px 16px rgba(31, 45, 65, 0.06), inset 0 1px 1px rgba(255, 255, 255, 1)',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  position: 'relative'
                }}
              >
                <div>{m.text}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    fontSize: '10.5px',
                    color: isUser ? '#D2D7DB' : '#8292A2',
                    marginTop: '6px'
                  }}
                >
                  <span>{m.time}</span>
                  {isUser && <CheckCheck size={14} style={{ color: '#A7F3D0' }} />}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '11px 18px',
                borderRadius: '18px 18px 18px 3px',
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: '#566B7F',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(31, 45, 65, 0.06)'
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '2px solid #39586D',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.6s linear infinite'
                }}
              />
              <span>AI Agent sedang memahami perintah...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Ketik pesan stok (contoh: masuk 2 karton indomie dari unilever)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            style={{
              width: '100%',
              padding: '12px 18px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1.5px solid rgba(210, 215, 219, 0.75)',
              borderRadius: 'var(--radius-full)',
              color: '#1E2D3D',
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(44, 65, 86, 0.03), 0 1px 2px rgba(255, 255, 255, 0.8)',
              transition: 'all 0.18s ease'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: inputValue.trim()
              ? 'linear-gradient(135deg, #2C4156 0%, #39586D 100%)'
              : 'rgba(210, 215, 219, 0.6)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: inputValue.trim()
              ? '0 4px 14px rgba(44, 65, 86, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              : 'none',
            transition: 'all 0.18s ease',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
          }}
          title="Kirim pesan"
        >
          <Send size={18} />
        </button>
      </form>

      <style jsx global>{`
        .chip-btn:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(255, 255, 255, 1) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(31, 45, 65, 0.08) !important;
        }
        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>
    </div>
  );
};
