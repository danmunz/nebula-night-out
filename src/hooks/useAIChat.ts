import { useState, useCallback, useRef } from 'react';
import type { Message, Profile } from '../types';

const WORKER_URL = 'https://nebula-night-out-proxy.nebula-danmunz.workers.dev/chat';

function buildSystemPrompt(profile: Profile): string {
  return `You are ${profile.name}, a ${profile.species} from ${profile.homeworld}. You are ${profile.age} years old and work as a ${profile.occupation}. Your personality: ${profile.personality}. Your interests include: ${profile.interests.join(', ')}. You're looking for: ${profile.lookingFor}.

You're chatting on Nebula Night Out, an intergalactic dating app. Stay in character at all times. Be flirty, fun, and engaging. Keep responses 1-3 sentences. Use your species traits and personality to make the conversation unique. Never break character or mention being an AI. Occasionally reference your homeworld, occupation, or interests naturally.`;
}

// In dev, uses local API key directly. In prod, proxies through Cloudflare Worker.
export function useAIChat(apiKey: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    profile: Profile,
    messages: Message[],
    userMessage: string
  ): Promise<string | null> => {
    // Use worker proxy when no local API key (production on GH Pages)
    const useProxy = !apiKey;
    const url = useProxy ? WORKER_URL : 'https://api.openai.com/v1/chat/completions';

    const chatMessages = [
      { role: 'system' as const, content: buildSystemPrompt(profile) },
      ...messages.slice(-20).map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (!useProxy) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const body = useProxy
        ? { messages: chatMessages }
        : { model: 'gpt-4o-mini', messages: chatMessages, max_tokens: 150, temperature: 0.9 };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        signal: abortRef.current.signal,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? null;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return null;
      console.error('AI chat error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, isLoading, cancel };
}
