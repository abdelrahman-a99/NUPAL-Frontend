'use client';

import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isPinned?: boolean;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onPinChat: (chatId: string) => void;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onSearchChange,
  onToggleSidebar,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  const handleStartRename = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      onRenameChat(chatId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(chatId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handlePinChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onPinChat(chatId);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] w-80 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      {/* Sidebar Header with Toggle */}
      <div className="flex items-center justify-end px-4 pt-4 pb-2">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
          title="Close sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="9" x2="9" y1="3" y2="21" />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <button
          onClick={onNewChat}
          className="w-full rounded-lg bg-blue-400 px-4 py-3 text-sm font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-500"
        >
          + New Chat
        </button>
      </div>

      {/* Search Section */}
      <div className="px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* My Chats Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            My Chats
          </h3>
          <div className="space-y-1">
            {filteredChats.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'No chats found' : 'No chats yet'}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative"
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-200 relative ${editingId === chat.id ? 'pr-3' : 'pr-[110px]'} ${activeChatId === chat.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      {chat.isPinned && (
                        <svg className="h-3 w-3 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 9V4l1 0V2H7v2h1v5L6 11v2h5v7l1 1 1-1v-7h5v-2l-2-2z" />
                        </svg>
                      )}
                      {editingId === chat.id ? (
                        <input
                          autoFocus
                          className="w-full bg-white border border-blue-400 rounded px-1 py-0.5 text-sm font-semibold outline-none"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleSaveRename(chat.id)}
                          onKeyDown={(e) => handleKeyDown(e, chat.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          className="truncate text-sm font-semibold flex-1"
                          title={chat.title}
                        >
                          {chat.title}
                        </div>
                      )}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {chat.lastMessage}
                    </div>
                  </button>

                  {/* Action Buttons Container */}
                  <div className={`absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ${editingId === chat.id ? 'hidden' : 'flex'}`}>
                    <button
                      onClick={(e) => handlePinChat(e, chat.id)}
                      className={`rounded-md p-1.5 transition-colors ${chat.isPinned ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-500'}`}
                      title={chat.isPinned ? "Unpin" : "Pin"}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 9V4l1 0V2H7v2h1v5L6 11v2h5v7l1 1 1-1v-7h5v-2l-2-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleStartRename(e, chat)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-blue-500 transition-colors"
                      title="Rename"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete chat"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

