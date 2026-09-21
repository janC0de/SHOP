import { useCallback, useState } from 'react'
import type { ChatMessage } from '../types'

function createId() {
  return crypto.randomUUID()
}

/** Parses one `event: ...\ndata: ...` SSE block into its type and JSON payload. */
function parseSseBlock(block: string): { event: string; data: unknown } | null {
  const eventMatch = block.match(/^event: (.+)$/m)
  const dataMatch = block.match(/^data: (.+)$/m)
  if (!dataMatch) return null
  return {
    event: eventMatch?.[1] ?? 'message',
    data: JSON.parse(dataMatch[1]),
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      setError(null)
      const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed }
      const assistantId = createId()
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }))

      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: 'assistant', content: '' }])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        })

        if (!response.ok || !response.body) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error ?? 'Something went wrong, try again.')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let receivedAnyText = false

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let boundary = buffer.indexOf('\n\n')
          while (boundary !== -1) {
            const block = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)
            boundary = buffer.indexOf('\n\n')

            const parsed = parseSseBlock(block)
            if (!parsed) continue

            if (parsed.event === 'delta') {
              const { text: delta } = parsed.data as { text: string }
              receivedAnyText = true
              setIsLoading(false)
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
              )
            } else if (parsed.event === 'error') {
              const { message } = parsed.data as { message: string }
              throw new Error(message)
            }
          }
        }

        if (!receivedAnyText) {
          throw new Error('Something went wrong, try again.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong, try again.')
        // Drop the empty assistant placeholder - nothing streamed successfully.
        setMessages((prev) => prev.filter((m) => !(m.id === assistantId && m.content === '')))
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading],
  )

  return { messages, sendMessage, isLoading, error, clearError: () => setError(null) }
}
