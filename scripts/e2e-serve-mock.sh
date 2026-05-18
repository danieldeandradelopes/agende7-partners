#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

exec env \
  NEXT_PUBLIC_API_URL=http://localhost:3000 \
  pnpm dev
