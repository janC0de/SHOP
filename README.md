# Nova - AI Chat Assistant

A polished, single-purpose chat product demo powered by the [Anthropic API](https://docs.anthropic.com/).
A hero section introduces the assistant, and a chat interface below streams
Claude's responses token-by-token.

## Tech stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Backend:** Express, proxying streaming requests to the Anthropic Messages API
- **Streaming:** Server-Sent Events (SSE) from the backend, consumed via `fetch` + `ReadableStream` on the client

The API key lives only on the server - the browser never talks to Anthropic directly.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

Copy the example env file and paste in your key from the
[Anthropic Console](https://console.anthropic.com/settings/keys):

```bash
cp .env.example .env
```

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run it

```bash
npm run dev
```

This starts both the Vite dev server (`http://localhost:5173`) and the Express
backend (`http://localhost:3001`) together. Vite proxies `/api/*` requests to
the backend, so just open **http://localhost:5173**.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Run frontend + backend together in watch mode |
| `npm run build` | Type-check and build the frontend for production (outputs to `dist/`) |
| `npm start` | Run the production server, which also serves the built frontend from `dist/` |
| `npm run lint` | Lint the codebase |

## Project structure

```
src/                  React frontend
  components/         Hero, chat window, message bubbles, input, error banner
  hooks/useChat.ts     Chat state + SSE streaming client
server/
  index.ts             Express app; POST /api/chat streams from the Anthropic API
```

## How streaming works

1. The client POSTs the full conversation history to `POST /api/chat`.
2. The server calls `anthropic.messages.stream(...)` and forwards each text
   token to the client as an SSE `delta` event as it arrives.
3. The client appends each delta to the in-progress assistant message, so text
   appears incrementally rather than all at once.
4. A `done` event closes out the turn; an `error` event (rate limits, auth
   failures, network issues, refusals) surfaces a friendly message in the UI.

## Configuration

All configuration is via environment variables (see `.env.example`):

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-5` | Model used for chat responses |
| `PORT` | No | `3001` | Port the Express server listens on |

## Notes

- Conversation history is kept in memory on the client for the current
  session only - refreshing the page starts a new conversation. There is no
  database.
- The system prompt (Nova's tone and personality) lives in `server/index.ts`.
