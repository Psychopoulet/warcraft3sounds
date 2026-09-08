#!/usr/bin/env bash
# Runs on the EC2 (SSM). Pulls the versioned image and executes the same deploy.sh as local.

set -euo pipefail

: "${ECR_REGISTRY:?}"
: "${ECR_REPOSITORY:?}"
: "${VERSION:?}"
: "${AWS_REGION:?}"

REPO_DIR="${REPO_DIR:-/opt/warcraft3sounds}"
export COLOR_FILE="${COLOR_FILE:-/opt/warcraft3sounds/state/current-color}"
export CERTS_HOST_DIR="${CERTS_HOST_DIR:-/opt/warcraft3sounds/certs}"

mkdir -p "$(dirname "${COLOR_FILE}")"

aws ecr get-login-password --region "${AWS_REGION}" \
    | docker login --username AWS --password-stdin "${ECR_REGISTRY}"

APP_IMAGE="${ECR_REGISTRY}/${ECR_REPOSITORY}"
docker pull "${APP_IMAGE}:${VERSION}"

cd "${REPO_DIR}"
git fetch --tags origin
git checkout --force "${VERSION}"

bash "${REPO_DIR}/scripts/deploy.sh" --env aws --image "${APP_IMAGE}" --tag "${VERSION}"
