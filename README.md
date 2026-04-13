# Codex CLI + OpenRouter (No WebSocket Warnings)

Codex uses WebSocket by default for the Responses API. OpenRouter doesn't support it, causing:
- 5 retry attempts (~15s delay)
- "Runtime warning" boxes in the TUI
- `wss://openrouter.ai/api/v1/responses` → 404

The fix: a tiny local proxy that accepts WebSocket then instantly closes it.

## Setup

### 1. Copy proxy script
```bash
cp codex/codex_proxy.mjs /tmp/codex_proxy.mjs
```

### 2. Edit your OpenRouter API key in the proxy script
Replace the `API_KEY` constant at the top of `/tmp/codex_proxy.mjs`.

### 3. Copy config
```bash
cp codex/config.example.toml ~/.codex/config.toml
```

### 4. Start the proxy
```bash
node /tmp/codex_proxy.mjs &
```

### 5. Run Codex
```bash
codex
```

## How it works

```
Codex  ──WS upgrade──┐
                     ├──► Proxy (port 8009) ──WS accept + close──► Codex falls back to HTTP
Codex  ──HTTP POST──┘                      ──Proxy to OpenRouter──► Response
```

## Notes
- Proxy uses Node.js (install via `brew install node` if needed)
- One-time auto-start: add `node /tmp/codex_proxy.mjs &>/dev/null &` to your `~/.zshrc`
- If you rotate your OpenRouter key, update `API_KEY` in the proxy script
