import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIChat } from '../hooks/useAIChat';
import type { Profile, Message } from '../types';

const mockProfile: Profile = {
  id: 'p001',
  name: 'Zara Nebulith',
  species: 'Nebulari',
  age: 127,
  gender: 'Female',
  homeworld: 'Nebula Prime',
  occupation: 'Chromatic Energy Weaver',
  bio: 'Test bio',
  interests: ['Nebula Photography', 'Plasma Dancing'],
  distance: '4.2 ly',
  personality: 'Radiant and honest.',
  lookingFor: 'Transparency',
  dealbreakers: 'Dishonesty',
  height: '5\'8"',
  zodiac: 'Aurora',
  photos: ['https://api.dicebear.com/7.x/adventurer/svg?seed=zara-1'],
};

describe('useAIChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with isLoading false', () => {
    const { result } = renderHook(() => useAIChat('sk-test'));
    expect(result.current.isLoading).toBe(false);
  });

  it('returns the AI response on success with local key', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Hello from Zara!' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useAIChat('sk-test-key'));

    let response: string | null = null;
    await act(async () => {
      response = await result.current.sendMessage(mockProfile, [], 'Hi!');
    });

    expect(response).toBe('Hello from Zara!');
    expect(result.current.isLoading).toBe(false);

    // Verify it called OpenAI directly with the API key
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test-key',
        }),
      }),
    );
  });

  it('uses worker proxy when no API key', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Proxy reply!' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useAIChat(null));

    let response: string | null = null;
    await act(async () => {
      response = await result.current.sendMessage(mockProfile, [], 'Hi!');
    });

    expect(response).toBe('Proxy reply!');

    // Should call worker URL, not OpenAI directly
    const callUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callUrl).toContain('workers.dev/chat');
  });

  it('returns null on API error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAIChat('sk-bad'));

    let response: string | null = null;
    await act(async () => {
      response = await result.current.sendMessage(mockProfile, [], 'Hi!');
    });

    expect(response).toBeNull();
  });

  it('returns null on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAIChat('sk-test'));

    let response: string | null = null;
    await act(async () => {
      response = await result.current.sendMessage(mockProfile, [], 'Hi!');
    });

    expect(response).toBeNull();
  });

  it('includes message history in the request', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'reply' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const history: Message[] = [
      { id: '1', profileId: 'p001', content: 'Hello', sender: 'user', timestamp: 1 },
      { id: '2', profileId: 'p001', content: 'Hi back!', sender: 'match', timestamp: 2 },
    ];

    const { result } = renderHook(() => useAIChat('sk-test'));

    await act(async () => {
      await result.current.sendMessage(mockProfile, history, 'How are you?');
    });

    const fetchCall = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    // system + 2 history + 1 new = 4 messages
    expect(body.messages).toHaveLength(4);
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1]).toEqual({ role: 'user', content: 'Hello' });
    expect(body.messages[2]).toEqual({ role: 'assistant', content: 'Hi back!' });
    expect(body.messages[3]).toEqual({ role: 'user', content: 'How are you?' });
  });
});
