import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')

const PORT = Number(process.env.PORT) || 3001
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

const SYSTEM_PROMPT = `You are Nova, a friendly and knowledgeable AI assistant embedded in a product demo.
Be helpful, warm, and concise - prefer short, well-organized answers over long ones unless the user
asks for depth. Use plain language, avoid unnecessary hedging, and get straight to the point. When a
list or steps would help, use them; otherwise write in natural prose.`

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '[server] ANTHROPIC_API_KEY is not set - requests to /api/chat will fail. ' +
      'Copy .env.example to .env and add your key.',
  )
}

const anthropic = new Anthropic()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function isValidHistory(body: unknown): body is { messages: ChatMessage[] } {
  if (typeof body !== 'object' || body === null || !('messages' in body)) return false
  const { messages } = body as { messages: unknown }
  if (!Array.isArray(messages) || messages.length === 0) return false
  return messages.every(
    (m) =>
      typeof m === 'object' &&
      m !== null &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.length > 0,
  )
}

app.post('/api/chat', async (req, res) => {
  if (!isValidHistory(req.body)) {
    res.status(400).json({ error: 'Request body must include a non-empty `messages` array.' })
    return
  }

  const { messages } = req.body

  // Server-Sent Events: the client reads token deltas as they arrive.
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      output_config: { effort: 'low' },
      messages,
    })

    stream.on('text', (textDelta) => {
      send('delta', { text: textDelta })
    })

    const finalMessage = await stream.finalMessage()

    if (finalMessage.stop_reason === 'refusal') {
      send('error', { message: 'The assistant declined to respond to that message.' })
    }

    send('done', {})
  } catch (error) {
    console.error('[server] /api/chat error:', error)

    let message = 'Something went wrong, try again.'
    if (error instanceof Anthropic.RateLimitError) {
      message = 'The assistant is receiving too many requests right now. Please try again shortly.'
    } else if (error instanceof Anthropic.AuthenticationError) {
      message = 'The server has an invalid Anthropic API key.'
    } else if (error instanceof Anthropic.APIConnectionError) {
      message = 'Could not reach the Anthropic API. Check your connection and try again.'
    } else if (error instanceof Anthropic.APIError) {
      message = 'The assistant ran into an API error. Please try again.'
    } else if (error instanceof Anthropic.AnthropicError) {
      // Thrown client-side, before any request, when no credentials are configured at all.
      message = 'The server is missing an Anthropic API key. Set ANTHROPIC_API_KEY in .env.'
    }

    send('error', { message })
  } finally {
    res.end()
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// In production, serve the Vite build output directly from this server.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir))
  // Express 5 (path-to-regexp v8) requires a named wildcard parameter.
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})
