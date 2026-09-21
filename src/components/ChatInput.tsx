import { useRef, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const value = textareaRef.current?.value ?? ''
    if (!value.trim() || disabled) return
    onSend(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const autoGrow = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex items-end gap-2 border-t border-slate-200 bg-white/80 p-3 backdrop-blur sm:p-4 dark:border-slate-800 dark:bg-slate-950/80">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Message Nova..."
        onKeyDown={handleKeyDown}
        onInput={autoGrow}
        disabled={disabled}
        className="max-h-40 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled}
        aria-label="Send message"
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm transition duration-200 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </button>
    </div>
  )
}
