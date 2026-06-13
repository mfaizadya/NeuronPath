import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createConsultationSession } from '../src/services/aiService';

//AI

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
    import.meta.env.VITE_OPENROUTER_API_KEY = 'test-key';
  });

  it('throws error if API key is missing', () => {
    import.meta.env.VITE_OPENROUTER_API_KEY = '';
    expect(() => createConsultationSession({})).toThrow('API Key OpenRouter belum dikonfigurasi');
  });

  it('creates session and sends message successfully', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Halo dari AI!' } }]
      })
    });

    const session = createConsultationSession({ username: 'Budi' });
    const reply = await session.sendMessage('Test');

    expect(reply).toBe('Halo dari AI!');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(session.history.length).toBe(3); // system, user, assistant
  });

  it('throws error on bad response', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    const session = createConsultationSession({});
    await expect(session.sendMessage('Test')).rejects.toThrow('OpenRouter error 500: Internal Server Error');
  });

  it('returns fallback message if choices empty', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [] })
    });

    const session = createConsultationSession({});
    const reply = await session.sendMessage('Test');

    expect(reply).toBe('Maaf, saya tidak bisa memproses permintaan Anda saat ini.');
  });
});
