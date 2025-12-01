'use client';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-400 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
    </div>
  );
}

