#!/usr/bin/env bash
set -euo pipefail

npx wait-on \
  "http-get://localhost:3000/uptimerobot" \
  "http-get://localhost:3002" \
  -t 180000
