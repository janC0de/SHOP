import type { ChatMessage } from '../types'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`animate-fade-in flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm sm:max-w-[75%] ${
          isUser
            ? 'rounded-br-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
