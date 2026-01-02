'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit(e);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const renderInputForm = (isCentered: boolean) => (
    <form onSubmit={handleSubmit} className={`mx-auto max-w-3xl w-full ${isCentered ? '' : ''}`}>
      <div className="relative flex items-end">
        <div
          onClick={handleContainerClick}
          className="flex-1 cursor-text rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20"
        >
          <div className="flex items-center">
            <textarea
              ref={inputRef}
              id={isCentered ? "centeredMessageInput" : "messageInput"}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none rounded-lg bg-transparent px-5 py-4 pr-14 text-base text-slate-900 placeholder-slate-500 focus:outline-none"
              style={{ maxHeight: '150px' }}
              required
            />
            <button
              id={isCentered ? "sendButtonCentered" : "sendButton"}
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`group absolute right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-transparent transition-all duration-300 hover:bg-blue-50 disabled:opacity-50 ${!inputMessage.trim() || isLoading ? 'pointer-events-none' : 'cursor-pointer'
                }`}
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300"
              >
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke={inputMessage.trim() && !isLoading ? '#3b82f6' : '#9ca3af'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className={`transition-all duration-300 ${inputMessage.trim() && !isLoading ? 'group-hover:stroke-blue-500 group-hover:fill-blue-500' : ''}`}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex h-full flex-1 flex-col bg-white overflow-hidden">
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto px-6 ${messages.length === 0 ? 'flex items-center justify-center pb-20' : 'py-6'}`}>
        {messages.length === 0 ? (
          <div className="w-full max-w-2xl px-4 text-center">
            {/* Centered Initial View */}
            <div className="mb-4">
              <h2 className="text-xl font-medium text-slate-700">
                How can I help you today?
              </h2>
            </div>
            {renderInputForm(true)}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[70%] rounded-2xl bg-slate-100 px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Persistent Bottom Input Area (Only visible when there are messages) */}
      {messages.length > 0 && (
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          {renderInputForm(false)}
        </div>
      )}
    </div>
  );
}

