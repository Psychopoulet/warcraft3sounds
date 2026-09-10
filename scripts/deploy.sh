#!/usr/bin/env bash
# Blue/green: start the idle color, wait /health, reload nginx, stop the old color.
# Used by cd-local and by publish-aws (SSM) — same script.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=./compose.sh
source "${ROOT}/scripts/compose.sh"

DEPLOY_ENV="local"
APP_IMAGE_NAME="warcraft3sounds"
APP_TAG="local"
COLOR_FILE="${COLOR_FILE:-${ROOT}/deploy/current-color}"
UPSTREAM_FILE="${ROOT}/deploy/nginx/runtime/upstream.conf"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-90}"

usage() {
    echo "Usage: $0 --env local|aws [--image NAME] [--tag TAG]" >&2
    exit 2
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --env) DEPLOY_ENV="${2:-}"; shift 2 ;;
        --image) APP_IMAGE_NAME="${2:-}"; shift 2 ;;
        --tag) APP_TAG="${2:-}"; shift 2 ;;
        -h|--help) usage ;;
        *) echo "Unknown argument: $1" >&2; usage ;;
    esac
done

if [[ "${DEPLOY_ENV}" != "local" && "${DEPLOY_ENV}" != "aws" ]]; then
    echo "error: --env must be local or aws" >&2
    exit 1
fi

export DEPLOY_ENV
export APP_IMAGE="${APP_IMAGE_NAME}:${APP_TAG}"

opposite() {
    if [[ "$1" == "blue" ]]; then
        echo "green"
    else
        echo "blue"
    fi
}

wait_health() {
    local service="$1"
    local elapsed=0
    while (( elapsed < HEALTH_TIMEOUT )); do
        if compose exec -T "${service}" curl -fsS "http://127.0.0.1:8000/health" >/dev/null 2>&1; then
            return 0
        fi
        sleep 2
        elapsed=$((elapsed + 2))
    done
    echo "error: ${service} did not become healthy within ${HEALTH_TIMEOUT}s — abort, no nginx switch" >&2
    return 1
}

write_upstream() {
    local color="$1"
    mkdir -p "$(dirname "${UPSTREAM_FILE}")"
    printf 'server app-%s:8000;\n' "${color}" > "${UPSTREAM_FILE}"
}

reload_nginx() {
    compose exec -T nginx nginx -s reload
}

verify_nginx_health() {
    if [[ "${DEPLOY_ENV}" == "local" ]]; then
        curl -kfsS "https://127.0.0.1:8443/health" >/dev/null
    else
        curl -kfsS "https://127.0.0.1/health" >/dev/null
    fi
}

service_running() {
    local service="$1"
    compose ps --status running --services 2>/dev/null | grep -qx "${service}"
}

mkdir -p "$(dirname "${COLOR_FILE}")"
mkdir -p "$(dirname "${UPSTREAM_FILE}")"
CURRENT="blue"
if [[ -f "${COLOR_FILE}" ]]; then
    CURRENT="$(tr -d '[:space:]' < "${COLOR_FILE}")"
fi
if [[ "${CURRENT}" != "blue" && "${CURRENT}" != "green" ]]; then
    CURRENT="blue"
fi

if ! service_running "app-${CURRENT}" && ! service_running "app-$(opposite "${CURRENT}")"; then
    echo "bootstrap: starting app-${CURRENT} (${APP_IMAGE}) + nginx"
    write_upstream "${CURRENT}"
    compose up -d --no-deps "app-${CURRENT}"
    wait_health "app-${CURRENT}"
    compose up -d --no-deps nginx
    verify_nginx_health
    printf '%s\n' "${CURRENT}" > "${COLOR_FILE}"
    echo "bootstrap done — active=${CURRENT}"
    exit 0
fi

NEW="$(opposite "${CURRENT}")"
echo "rolling: ${CURRENT} -> ${NEW} (${APP_IMAGE})"

compose up -d --no-deps --force-recreate "app-${NEW}"
wait_health "app-${NEW}"

write_upstream "${NEW}"
compose up -d --no-deps nginx
reload_nginx
if ! verify_nginx_health; then
    echo "error: nginx /health failed after switch to ${NEW} — reverting upstream to ${CURRENT}" >&2
    write_upstream "${CURRENT}"
    reload_nginx
    exit 1
fi

printf '%s\n' "${NEW}" > "${COLOR_FILE}"
compose stop "app-${CURRENT}"
echo "rolling done — active=${NEW}"
