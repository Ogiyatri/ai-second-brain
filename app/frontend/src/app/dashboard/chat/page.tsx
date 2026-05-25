'use client';
import { useEffect } from 'react';
import { SessionList } from '@/components/chat/SessionList';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/chat';

export default function ChatPage() {
  const { sessions, activeSession, messages, isLoading, loadSessions, selectSession, newSession, sendMessage } = useChat();

  useEffect(() => { loadSessions(); }, [loadSessions]);

  return (
    <div className="flex h-[calc(100vh-3rem)] overflow-hidden rounded-lg border">
      <SessionList
        sessions={sessions}
        activeId={activeSession?.id}
        onSelect={selectSession}
        onNew={newSession}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        <ChatInput onSend={(text) => sendMessage(text)} isLoading={isLoading} />
      </div>
    </div>
  );
}
