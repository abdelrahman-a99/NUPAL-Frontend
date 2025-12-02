'use client';

import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSearchChange: (query: string) => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSearchChange,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    onDeleteChat(chatId);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] w-80 flex-col border-r border-slate-100 bg-white">
      {/* Logo Section */}
      {/* <div className="px-6 py-4">
        <span className="text-xl font-bold text-slate-900">NU PAL</span>
      </div> */}

      {/* New Chat Button */}
      <div className="px-4 py-4">
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
                    className={`w-full rounded-lg px-3 py-2.5 pr-10 text-left transition-colors duration-200 ${activeChatId === chat.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="mb-1 truncate text-sm font-semibold">
                      {chat.title}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {chat.lastMessage}
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    title="Delete chat"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

