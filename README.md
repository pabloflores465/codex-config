codex-config/

# Codex CLI configuration templates

## Setup
1. Copy the template: `cp codex/config.example.toml ~/.codex/config.toml`
2. Set your API key: `export OPENROUTER_API_KEY="sk-or-v1-..."`
3. Start Codex: `codex`

## Files
- **`codex/config.example.toml`** — Codex config routing through OpenRouter
- **`codex/auth.example.json`** — Template for API key auth (requires manual key entry)

## Notes
- All secrets live in env vars (`OPENROUTER_API_KEY`), never in tracked files
- `auth.json` stores the key only for TUI bootstrap; the env var should also be set
- Default model: `qwen/qwen3.6-plus` via OpenRouter
