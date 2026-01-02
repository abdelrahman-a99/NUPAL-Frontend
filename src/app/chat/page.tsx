'use client';

import { useState, useCallback } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { sendMessage } from '@/services/chatService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isPinned?: boolean;
  messages: Message[];
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Get active chat messages
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];


  // Sort chats: pinned first, then chronological
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0; // Maintain relative order for same pin status
  });

  // Generate chat title from first message
  const generateChatTitle = (message: string): string => {
    const trimmed = message.trim();
    if (trimmed.length === 0) return 'New Chat';
    // Take first 30 characters or first sentence
    const firstSentence = trimmed.split(/[.!?]/)[0];
    const title = firstSentence.length > 30
      ? trimmed.substring(0, 30) + '...'
      : firstSentence || trimmed.substring(0, 30);
    return title || 'New Chat';
  };

  const handleNewChat = useCallback(() => {
    // Check if there's already an empty chat
    const emptyChat = chats.find((chat) => chat.messages.length === 0);

    if (emptyChat) {
      // If an empty chat exists, just switch to it
      setActiveChatId(emptyChat.id);
      return;
    }

    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      lastMessage: 'Start a conversation...',
      timestamp: 'Just now',
      isPinned: false,
      messages: [],
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChatId);
  }, [chats]);

  const handleRenameChat = useCallback((chatId: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  }, []);

  const handlePinChat = useCallback((chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  }, []);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      let currentChatId = activeChatId;

      // Create new chat if none is active
      if (!currentChatId) {
        const newChatId = `chat-${Date.now()}`;
        const newChat: Chat = {
          id: newChatId,
          title: 'New Chat',
          lastMessage: messageText,
          timestamp: 'Just now',
          messages: [],
        };
        setChats((prevChats) => [newChat, ...prevChats]);
        setActiveChatId(newChatId);
        currentChatId = newChatId;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Update chat with user message and generate title if it's the first message
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            const isFirstMessage = chat.messages.length === 0;
            return {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastMessage: messageText,
              timestamp: 'Just now',
              title: isFirstMessage ? generateChatTitle(messageText) : chat.title,
            };
          }
          return chat;
        })
      );

      setIsLoading(true);

      try {
        // Prepare API request
        // If the ID starts with 'chat-', it's a local temporary ID, so don't send it as conversation_id
        const apiConversationId = currentChatId.startsWith('chat-') ? undefined : currentChatId;

        const response = await sendMessage({
          conversation_id: apiConversationId,
          message: messageText,
        });

        const newConversationId = response.conversation_id;

        // Map replies to Message objects
        const botMessages: Message[] = response.replies.map((reply, index) => ({
          id: `${newConversationId}-${Date.now()}-${index}`,
          text: reply.content,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                id: newConversationId, // Update to the real conversation ID from backend
                messages: [...chat.messages, ...botMessages],
                lastMessage: botMessages[botMessages.length - 1]?.text || chat.lastMessage,
                timestamp: 'Just now',
              };
            }
            return chat;
          })
        );

        // Also update activeChatId if it was the one we just updated
        if (activeChatId === currentChatId) {
          setActiveChatId(newConversationId);
        }
      } catch (error: any) {
        console.error('Failed to get bot response:', error);
        // Add an error message to the chat
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          text: error.message || 'Sorry, I encountered an error. Please try again later.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
              }
              : chat
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeChatId]
  );

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    // Search is handled in ChatSidebar component
    // This callback can be used for additional search logic if needed
  }, []);

  const handleDeleteChat = useCallback((chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

    // If the deleted chat was active, clear the active chat
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  }, [activeChatId]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white relative">
      {/* Floating Toggle Button (Visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
          title="Open sidebar"
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
      )}

      <div
        className={`flex h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0'
          } overflow-hidden`}
      >
        <ChatSidebar
          chats={sortedChats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onPinChat={handlePinChat}
          onSearchChange={handleSearchChange}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

