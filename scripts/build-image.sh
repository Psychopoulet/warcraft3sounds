#!/usr/bin/env bash
# Build app artefacts then the Docker image (deploy/Dockerfile copies lib/cjs + public/dist).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

IMAGE="${1:-warcraft3sounds}"
TAG="${2:-local}"

npm run build
docker build -f deploy/Dockerfile -t "${IMAGE}:${TAG}" .
