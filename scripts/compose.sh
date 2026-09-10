#!/usr/bin/env bash
# Shared docker compose invocation (local | aws). Sourced by deploy / cd-local.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="${ROOT}/deploy"

compose() {
    local env_name="${DEPLOY_ENV:?DEPLOY_ENV must be local or aws}"
    local overlay="${DEPLOY_DIR}/docker-compose.${env_name}.yml"
    docker compose \
        --project-name warcraft3sounds \
        -f "${DEPLOY_DIR}/docker-compose.yml" \
        -f "${overlay}" \
        "$@"
}
