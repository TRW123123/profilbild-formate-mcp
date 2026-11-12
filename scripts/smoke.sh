#!/usr/bin/env bash
# MCP-Smoke: health, initialize, tools/list, tools/call positiv und negativ.
set -euo pipefail
base="${1:-http://127.0.0.1:8793}"
call() {
  curl --fail-with-body --silent --show-error --max-time 10 "$base/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data "$1"
  echo
}
curl --fail --silent --show-error --max-time 10 "$base/health"; echo
call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}'
call '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_profilbild_formate","arguments":{"plattform":"linkedin"}}}'
call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"list_profilbild_plattformen","arguments":{}}}'
echo '# negativ (erwartet isError=true):'
call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_profilbild_formate","arguments":{"plattform":"tiktok"}}}'
call '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"get_profilbild_formate","arguments":{}}}'
