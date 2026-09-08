#!/usr/bin/env bash
# Local CD: self-signed certs (gitignored) + image warcraft3sounds:local + blue/green.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="${ROOT}/deploy/nginx/certs"

mkdir -p "${CERT_DIR}"

if [[ ! -f "${CERT_DIR}/fullchain.pem" || ! -f "${CERT_DIR}/privkey.pem" ]]; then
    echo "generating self-signed TLS cert for localhost (not committed)"
    if command -v openssl >/dev/null 2>&1; then
        openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
            -keyout "${CERT_DIR}/privkey.pem" \
            -out "${CERT_DIR}/fullchain.pem" \
            -subj "/CN=localhost" \
            -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    else
        docker run --rm -v "${CERT_DIR}:/certs" alpine:3.21 \
            sh -c 'apk add --no-cache openssl >/dev/null && openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
                -keyout /certs/privkey.pem -out /certs/fullchain.pem \
                -subj "/CN=localhost" \
                -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"'
    fi
fi

bash "${ROOT}/scripts/build-image.sh" warcraft3sounds local
bash "${ROOT}/scripts/deploy.sh" --env local --image warcraft3sounds --tag local

echo "local CD ready: https://127.0.0.1:8443/health  (curl -k)"
