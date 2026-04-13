# Codex CLI + OpenRouter (Working, No Warnings)

Routes Codex through OpenRouter via a local proxy. Eliminates:
- WebSocket 404 errors (OpenRouter doesn't support WS)
- 5× reconnect delays (~15s)
- TUI "Runtime warning" boxes

## Setup

### 1. Install the proxy
```bash
mkdir -p ~/.local/bin
cp codex/codex_proxy.mjs ~/.local/bin/codex_proxy.mjs
```

### 2. Edit your API key
Replace `API_KEY` in `~/.local/bin/codex_proxy.mjs` with your OpenRouter key.

### 3. Start the proxy
```bash
node ~/.local/bin/codex_proxy.mjs &
```

### 4. Configure Codex
```bash
cp codex/config.example.toml ~/.codex/config.toml
```

### 5. Run Codex
```bash
codex
```

## How it works

```
Codex ──WS upgrade──► Proxy ─► 101 + close frame ─► Codex falls back to HTTP
Codex ──HTTP POST──► Proxy ─► https://openrouter.ai/api/... ─► Response
```

## Auto-start
Add to `~/.zshrc`:
```bash
(pgrep -f codex_proxy.mjs > /dev/null 2>&1) || (node ~/.local/bin/codex_proxy.mjs &>/dev/null &)
```

## Notes
- Proxy uses Node.js (installed via Node 24)
- `auth.json` is never committed
