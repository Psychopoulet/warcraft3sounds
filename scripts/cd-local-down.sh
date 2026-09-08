#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export DEPLOY_ENV="local"
# shellcheck source=./compose.sh
source "${ROOT}/scripts/compose.sh"

compose down --remove-orphans
