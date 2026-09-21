interface HeroProps {
  onStartChat: () => void
}

export function Hero({ onStartChat }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
      {/* Soft gradient blobs - decorative, kept subtle and blurred */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute top-[-10%] left-1/2 h-[28rem] w-[28rem] -translate-x-[70%] rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 opacity-40 blur-3xl dark:from-indigo-600 dark:to-purple-600 dark:opacity-20" />
        <div
          className="animate-blob absolute top-[10%] left-1/2 h-[24rem] w-[24rem] translate-x-[10%] rounded-full bg-gradient-to-br from-purple-300 to-pink-300 opacity-30 blur-3xl dark:from-purple-600 dark:to-pink-600 dark:opacity-20"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        Powered by Claude
      </span>

      <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
        Meet{' '}
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Nova
        </span>
        , your AI assistant
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400">
        Ask a question, brainstorm an idea, or get help writing something - Nova responds instantly,
        right in your browser.
      </p>

      <div className="mt-9">
        <button
          type="button"
          onClick={onStartChat}
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-indigo-500/20 transition duration-200 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          Start chatting
        </button>
      </div>
    </section>
  )
}
