'use client';

import { useState, useCallback } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

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
  messages: Message[];
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get active chat messages
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  // Generate a simple bot response (frontend only - replace with API call later)
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help you with your academic journey. How can I assist you today?';
    }
    if (lowerMessage.includes('course') || lowerMessage.includes('class')) {
      return 'I can help you with course selection and planning. What specific courses are you interested in?';
    }
    if (lowerMessage.includes('gpa') || lowerMessage.includes('grade')) {
      return 'I can help you understand GPA requirements and track your academic progress. What would you like to know?';
    }
    if (lowerMessage.includes('semester') || lowerMessage.includes('schedule')) {
      return 'I can assist you with semester planning and scheduling. Tell me more about what you need help with.';
    }
    if (lowerMessage.includes('advisor')) {
      return 'I can help you connect with academic advisors. Would you like to schedule a meeting or get advisor contact information?';
    }
    
    return 'Thank you for your message! I\'m here to help with your academic planning. Could you provide more details about what you need assistance with?';
  };

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
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      lastMessage: 'Start a conversation...',
      timestamp: 'Just now',
      messages: [],
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChatId);
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

      // Simulate API call delay
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(messageText),
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
                  messages: [...chat.messages, botResponse],
                  lastMessage: botResponse.text,
                  timestamp: 'Just now',
                }
              : chat
          )
        );

        setIsLoading(false);
      }, 1000);
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onSearchChange={handleSearchChange}
      />
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

