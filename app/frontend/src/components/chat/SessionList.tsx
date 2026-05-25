'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatChatDate } from '@/domains/chat';
import type { ChatSession } from '@/types/chat';

interface SessionListProps {
  sessions: ChatSession[];
  activeId: string | undefined;
  onSelect: (session: ChatSession) => void;
  onNew: () => void;
}

export function SessionList({ sessions, activeId, onSelect, onNew }: SessionListProps) {
  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r">
      <div className="p-3">
        <Button size="sm" className="w-full" onClick={onNew}>
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <ul className="space-y-1 px-2 pb-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onSelect(s)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${s.id === activeId ? 'bg-accent font-medium' : ''}`}
              >
                <span className="block truncate">{s.title || 'Chat'}</span>
                <span className="text-xs text-muted-foreground">{formatChatDate(s.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
