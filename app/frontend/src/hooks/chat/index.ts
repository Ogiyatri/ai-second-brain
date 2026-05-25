'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getChatSocket, disconnectChatSocket } from '@/lib/socket';
import { aiApi } from '@/api/ai.api';
import { to } from '@/lib/await-to-error';
import type { ChatSession, ChatMessage, ChatState } from '@/types/chat';

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<ChatState>({ isLoading: false, error: null });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getChatSocket();
    socketRef.current = socket;

    socket.on('message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      setState({ isLoading: false, error: null });
    });

    socket.on('error', (err: { message: string }) => {
      setState({ isLoading: false, error: err.message });
    });

    return () => {
      socket.off('message');
      socket.off('error');
      disconnectChatSocket();
    };
  }, []);

  const loadSessions = useCallback(async () => {
    const [, data] = await to(aiApi.listSessions());
    if (data) setSessions(data);
  }, []);

  const selectSession = useCallback(async (session: ChatSession) => {
    setActiveSession(session);
    setState({ isLoading: true, error: null });
    const [err, data] = await to(aiApi.getMessages(session.id));
    if (err || !data) { setState({ isLoading: false, error: 'Failed to load messages' }); return; }
    setMessages(data);
    setState({ isLoading: false, error: null });
    socketRef.current?.emit('join_session', { session_id: session.id });
  }, []);

  const newSession = useCallback(async () => {
    const [err, session] = await to(aiApi.createSession());
    if (err || !session) return;
    setSessions((prev) => [session, ...prev]);
    setActiveSession(session);
    setMessages([]);
    socketRef.current?.emit('join_session', { session_id: session.id });
  }, []);

  const sendMessage = useCallback(async (text: string, documentIds?: string[]) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      setState({ isLoading: false, error: 'Not connected to server' });
      return;
    }

    let sessionId = activeSession?.id;
    if (!sessionId) {
      const [err, session] = await to(aiApi.createSession());
      if (err || !session) { setState({ isLoading: false, error: 'Failed to create session' }); return; }
      setSessions((prev) => [session, ...prev]);
      setActiveSession(session);
      sessionId = session.id;
      socket.emit('join_session', { session_id: sessionId });
    }

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setState({ isLoading: true, error: null });

    socket.emit('chat', {
      message: text,
      session_id: sessionId,
      document_ids: documentIds,
    });
  }, [activeSession]);

  return { sessions, activeSession, messages, ...state, loadSessions, selectSession, newSession, sendMessage };
}

