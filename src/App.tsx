import { useRef } from 'react'
import { Hero } from './components/Hero'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { ErrorBanner } from './components/ErrorBanner'
import { useChat } from './hooks/useChat'

function App() {
  const { messages, sendMessage, isLoading, error, clearError } = useChat()
  const chatSectionRef = useRef<HTMLElement>(null)

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <Hero onStartChat={scrollToChat} />

      <section
        ref={chatSectionRef}
        id="chat"
        className="mx-4 mb-16 flex h-[75vh] max-w-2xl scroll-mt-6 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-md backdrop-blur sm:mx-auto sm:h-[70vh] dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="min-h-0 flex-1">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </section>

      <footer className="pb-10 text-center text-xs text-slate-400 dark:text-slate-600">
        Nova can make mistakes. Consider checking important information.
      </footer>
    </div>
  )
}

export default App
