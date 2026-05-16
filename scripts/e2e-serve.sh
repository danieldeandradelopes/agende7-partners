#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

exec npx concurrently -k \
  "cd \"$ROOT/agende7-backend\" && pnpm dev" \
  "cd \"$ROOT/agende7-partners\" && NEXT_PUBLIC_API_URL=http://localhost:3000 pnpm dev"
