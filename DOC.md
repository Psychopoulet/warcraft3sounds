# Deploy documentation (local + AWS)

How a new version is built, switched in (blue/green), and served over TLS. Local and production share the **same** rolling script and nginx TLS config. Only ports, certificate paths, and the image name change.

Related: implementation plan in [PLAN.md](./PLAN.md), console steps in [TUTO.md](./TUTO.md).

---

## Why a local deploy exists

Local deploy does **not** emulate AWS (no ECR, IAM, or SSM). It replays the **same** sequence the CD will run on the EC2: Docker image → nginx → one active color → `GET /health` → HTTPS.

That is how a 502, a bad switch, or a broken nginx cert is caught **before** the first `publish-aws`. You can:

- keep `GET /` up while the idle color starts;
- confirm a failing `/health` does **not** take the old color down;
- exercise TLS at `https://127.0.0.1:8443` with a gitignored self-signed cert.

---

## Runtime (who talks to whom)

nginx terminates TLS. Express / PM2 stay on plain HTTP `:8000` on the Docker network. Only **one** color is in `upstream.conf`.

```mermaid
flowchart TD
    Client([Client])
    Client -->|HTTP :80| Listen80["nginx listen 80<br/>http-local.conf or http-aws.conf"]
    Client -->|HTTPS :443| Listen443["nginx listen 443 ssl<br/>nginx.conf + certs"]
    Listen80 -->|ACME on AWS only| Acme["/.well-known/acme-challenge/"]
    Listen80 -->|301 to HTTPS| Listen443
    Listen443 --> Up["upstream.conf<br/>exactly one backend"]
    Up -->|active| Blue["app-blue :8000"]
    Up -->|active| Green["app-green :8000"]
```

The two arrows out of `upstream.conf` are exclusive: nginx points at **blue XOR green**, never both.

| | Local (`--env local`) | AWS (`--env aws`) |
| --- | --- | --- |
| TLS terminator | nginx `listen 443 ssl` | same |
| Host ports | **8000→80**, **8443→443** | **80→80**, **443→443** |
| HTTP | redirect to `https://127.0.0.1:8443` | redirect to `https://$host` + ACME |
| Certificate | self-signed under `deploy/nginx/certs/` (gitignored) | Let’s Encrypt under `/opt/warcraft3sounds/certs` |
| Image | `warcraft3sounds:local` | `${ECR}/warcraft3sounds:<version>` |

Overlays are **never** loaded together: `compose.sh` always uses the base file plus **one** overlay.

---

## How to run it locally

Needs Docker Compose v2 and bash.

```bash
npm run cd-local
```

Then:

```bash
curl -kfsS https://127.0.0.1:8443/health
# → {"status":"ok"}
```

A second `npm run cd-local` (after another image build) performs a **rolling** switch (blue ↔ green).

Stop:

```bash
npm run cd-local-down
```

---

## Flowcharts

### End-to-end (all deploy files)

Single path from **start deploy** to **service deployed**. Diamonds are conditions; each box names the files that apply. The four diagrams below are zoom-ins of the same flow.

```mermaid
flowchart TD
    Start(["START DEPLOY"])
    Start --> Who{"Who launches?"}

    Who -->|"developer on a laptop"| CdLocal["scripts/cd-local.sh"]
    Who -->|"GitHub Actions + SSM on EC2<br/>publish.yml when A7 exists"| Remote["scripts/publish-remote.sh"]

    CdLocal --> Cert{"PEM present?<br/>deploy/nginx/certs/fullchain.pem<br/>deploy/nginx/certs/privkey.pem"}
    Cert -->|no| GenCert["openssl or alpine container<br/>writes gitignored certs"]
    Cert -->|yes| Build
    GenCert --> Build["scripts/build-image.sh<br/>Dockerfile copies lib/cjs + public/dist"]
    Build -->|npm or docker build fails| FailBuild(["STOP — no containers started"])
    Build -->|ok| Deploy

    Remote --> Pull["ECR login + docker pull<br/>git checkout version tag"]
    Pull -->|login / pull / git fails| FailPull(["STOP — previous stack unchanged"])
    Pull -->|ok| Deploy

    Deploy["scripts/deploy.sh<br/>sources scripts/compose.sh"]
    Deploy --> Overlay{"--env local or prod?"}

    Overlay -->|local| FilesL["compose.sh loads<br/>deploy/docker-compose.yml<br/>+ deploy/docker-compose.local.yml<br/>nginx.conf + http-local.conf<br/>certs: deploy/nginx/certs/<br/>ports 8000 and 8443"]
    Overlay -->|prod / aws| FilesP["compose.sh loads<br/>deploy/docker-compose.yml<br/>+ deploy/docker-compose.aws.yml<br/>nginx.conf + http-aws.conf<br/>certs: /opt/warcraft3sounds/certs<br/>ACME webroot + ports 80 and 443"]

    FilesL --> Color
    FilesP --> Color
    Color["read COLOR_FILE<br/>local: deploy/current-color gitignored<br/>prod: /opt/warcraft3sounds/state/current-color<br/>default blue"]
    Color --> Running{"app-blue or app-green<br/>already running?"}

    Running -->|no — bootstrap| BootWrite["write deploy/nginx/upstream.conf<br/>server app-CURRENT:8000"]
    BootWrite --> BootUp["compose up app-CURRENT<br/>image APP_IMAGE"]
    BootUp --> H1{"container GET /health OK?<br/>lib/src/server/paths/health.ts<br/>Dockerfile HEALTHCHECK<br/>timeout 90s"}
    H1 -->|down / timeout| FailBoot(["STOP — nginx never started<br/>clients still off<br/>upstream.conf not serving"])
    H1 -->|ok| BootNx["compose up nginx<br/>nginx.conf + http-*.conf + certs"]
    BootNx --> Loc1{"local?"}
    Loc1 -->|yes| H2{"curl -k :8443/health<br/>through nginx + upstream.conf"}
    Loc1 -->|prod| BootSave
    H2 -->|down| FailNx(["STOP — app healthy,<br/>TLS or nginx.conf / http-local.conf bad"])
    H2 -->|ok| BootSave["write COLOR_FILE = CURRENT"]
    BootSave --> Done

    Running -->|yes — rolling| New["NEW = opposite of CURRENT"]
    New --> RollUp["compose up --force-recreate app-NEW<br/>old color keeps serving"]
    RollUp --> H3{"container GET /health on app-NEW OK?<br/>health.ts + Dockerfile HEALTHCHECK"}
    H3 -->|down / timeout| FailRoll(["STOP — upstream.conf unchanged<br/>old color still live"])
    H3 -->|ok| Switch["write upstream.conf → app-NEW<br/>nginx -s reload"]
    Switch --> Loc2{"local?"}
    Loc2 -->|yes| H4{"curl -k :8443/health via nginx"}
    Loc2 -->|prod| StopOld
    H4 -->|down| FailReload(["STOP — NEW already in upstream.conf<br/>old color not stopped yet"])
    H4 -->|ok| StopOld["compose stop app-OLD<br/>SIGTERM — main.cts + Dockerfile STOPSIGNAL"]
    StopOld --> Done

    Done(["SERVICE DEPLOYED<br/>client → nginx :443 → upstream.conf<br/>→ Express :8000 on the active color"])
```

Tear-down (not on this path): `scripts/cd-local-down.sh` → `compose.sh` → `docker compose down`.

---

### 1. Who starts the procedure

```mermaid
flowchart TD
    subgraph local [Local machine]
        Dev[Developer] --> CdLocal["bash scripts/cd-local.sh"]
        Dev --> CdDown["bash scripts/cd-local-down.sh"]
        CdDown --> ComposeDown["compose.sh → docker compose down"]
    end

    subgraph cd [GitHub CD — not wired yet, A7]
        Push["push to master + new package.json version"] --> TagJob["publish-tag-if-new-version"]
        TagJob -->|tag_created false| Skip[publish-aws skipped]
        TagJob -->|tag_created true| AwsJob["publish-aws"]
        AwsJob --> Ecr["build-image.sh + docker push ECR"]
        Ecr --> Ssm["SSM AWS-RunShellScript on EC2"]
        Ssm --> Remote["scripts/publish-remote.sh"]
    end

    CdLocal --> Build["scripts/build-image.sh"]
    Build --> DeployLocal["scripts/deploy.sh --env local"]
    Remote --> DeployAws["scripts/deploy.sh --env aws"]
```

### 2. `cd-local.sh` route

```mermaid
flowchart TD
    Start["cd-local.sh"] --> Cert{"fullchain.pem + privkey.pem<br/>in deploy/nginx/certs?"}
    Cert -->|no| OpenSSL["openssl req -x509<br/>or Docker alpine+openssl"]
    Cert -->|yes| Build
    OpenSSL --> Build["build-image.sh<br/>npm run build + docker build<br/>warcraft3sounds:local"]
    Build -->|build fails| FailBuild["exit ≠ 0 — no containers touched"]
    Build -->|ok| Deploy["deploy.sh --env local<br/>--image warcraft3sounds --tag local"]
    Deploy --> End["print https://127.0.0.1:8443/health"]
```

### 3. `deploy.sh` — bootstrap vs rolling, and failures

```mermaid
flowchart TD
    Start["deploy.sh --env local|aws"] --> Compose["source compose.sh<br/>export APP_IMAGE"]
    Compose --> Read["read COLOR_FILE<br/>default blue"]
    Read --> Running{"any app-blue or<br/>app-green running?"}

    Running -->|no — first time| BootUp["write upstream → CURRENT<br/>compose up app-CURRENT"]
    BootUp --> BootHealth{"curl /health inside<br/>app-CURRENT ≤ 90s?"}
    BootHealth -->|no| AbortBoot["exit 1<br/>nginx never started<br/>no color switch"]
    BootHealth -->|yes| BootNginx["compose up nginx"]
    BootNginx --> BootCurl{"env == local?"}
    BootCurl -->|yes| BootTLS["curl -k https://127.0.0.1:8443/health"]
    BootTLS -->|fail| AbortTLS["exit 1 — app is up,<br/>TLS/nginx misconfigured"]
    BootCurl -->|no| BootSave
    BootTLS -->|ok| BootSave["write COLOR_FILE = CURRENT"]
    BootSave --> BootDone["bootstrap done"]

    Running -->|yes| New["NEW = opposite CURRENT"]
    New --> RollUp["compose up --force-recreate app-NEW"]
    RollUp --> RollHealth{"curl /health inside<br/>app-NEW ≤ 90s?"}
    RollHealth -->|no| AbortRoll["exit 1<br/>upstream unchanged<br/>old color still serving"]
    RollHealth -->|yes| Switch["write upstream → NEW<br/>nginx -s reload"]
    Switch --> RollCurl{"env == local?"}
    RollCurl -->|yes| RollTLS["curl -k https://127.0.0.1:8443/health"]
    RollTLS -->|fail| AbortAfterReload["exit 1 — NEW is in upstream;<br/>old color not stopped yet"]
    RollCurl -->|no| StopOld
    RollTLS -->|ok| StopOld["COLOR_FILE = NEW<br/>compose stop app-CURRENT"]
    StopOld --> RollDone["rolling done"]
```

Failure rule: **start-first**. A dead `/health` on the new color never rewrites `upstream.conf`, so users keep hitting the previous version.

### 4. HTTP path after a successful deploy (local)

```mermaid
flowchart LR
    Browser["Browser / curl"] -->|http :8000| H80["nginx listen 80"]
    H80 -->|301| H443["https://127.0.0.1:8443/…"]
    Browser -->|https :8443 -k| H443
    H443 --> Up["upstream.conf<br/>app-blue XOR app-green"]
    Up --> App["Express :8000"]
    App -->|/health| JSON["200 { status: ok }"]
    App -->|/| HTML["public/index.html"]
```

On AWS the same graph uses ports 80/443 and a public Let’s Encrypt certificate (no `curl -k`).

---

## Compose files

Docker Compose merges YAML. The base file says *what* runs; the overlay says *where it is published* and *which image*.

| File | Role |
| --- | --- |
| [`deploy/docker-compose.yml`](./deploy/docker-compose.yml) | Three services: `nginx`, `app-blue`, `app-green`. App `/health` checks, `stop_grace_period` 20s (time for `SIGTERM`). **No public app ports** — Node is only reachable on the Docker network. |
| [`deploy/docker-compose.local.yml`](./deploy/docker-compose.local.yml) | Host ports 8000/8443, cert bind `deploy/nginx/certs/`, image `warcraft3sounds:local`, HTTP redirect to `:8443`. |
| [`deploy/docker-compose.aws.yml`](./deploy/docker-compose.aws.yml) | Host ports 80/443, certs from `${CERTS_HOST_DIR}`, ACME webroot, image `${APP_IMAGE}`. |

Two identical app services exist so the **new** color can start while the **old** one still serves traffic.

---

## nginx files

| File | Role |
| --- | --- |
| [`deploy/nginx/nginx.conf`](./deploy/nginx/nginx.conf) | Shared: `listen 443 ssl`, `proxy_pass` to `upstream backend`. Same locally and on AWS. |
| [`deploy/nginx/upstream.conf`](./deploy/nginx/upstream.conf) | One line, e.g. `server app-blue:8000;`. **Rewritten by `deploy.sh`**, then `nginx -s reload` (keep-alive connections stay up). |
| [`deploy/nginx/http-local.conf`](./deploy/nginx/http-local.conf) | `listen 80` → `301` to `https://127.0.0.1:8443…` (host TLS is not on 443). |
| [`deploy/nginx/http-aws.conf`](./deploy/nginx/http-aws.conf) | `listen 80` → `301` to `https://$host…` **and** `/.well-known/acme-challenge/` for Let’s Encrypt. |

Each overlay mounts its HTTP snippet as `/etc/nginx/http-listen.conf`. `nginx.conf` includes that path, so there is a single `listen 80` block per environment.

---

## Shell scripts (who calls whom)

| Script | Role | Why it is a separate file |
| --- | --- | --- |
| [`scripts/compose.sh`](./scripts/compose.sh) | Defines `compose()`: `docker compose -f base -f overlay`. | Avoids repeating the four flags. **Sourced**, not meant to be run alone. |
| [`scripts/build-image.sh`](./scripts/build-image.sh) | `npm run build` then `docker build -t name:tag`. | The Dockerfile copies **already built** `lib/cjs` and `public/dist`. GitHub CD will call the same script before `docker push`. |
| [`scripts/deploy.sh`](./scripts/deploy.sh) | Rolling core: read active color → start the other → poll `/health` **inside** the container → rewrite `upstream.conf` → reload nginx → local HTTPS `curl` → stop the old color. Failed `/health` → **abort**, no switch. First run = bootstrap (one color + nginx). | **One** path for local and AWS (`--env`, `--image`, `--tag`). |
| [`scripts/cd-local.sh`](./scripts/cd-local.sh) | Dev orchestrator: self-signed cert if missing + build `warcraft3sounds:local` + `deploy.sh --env local`. | You should not have to chain three commands by hand. |
| [`scripts/cd-local-down.sh`](./scripts/cd-local-down.sh) | `compose down`. | Stops nginx and both colors without deleting the image. |
| [`scripts/publish-remote.sh`](./scripts/publish-remote.sh) | EC2 orchestrator: ECR login, `docker pull`, `git checkout` the version tag, `deploy.sh --env aws`. | GitHub CD does not open SSH; it will send this script via SSM. Unused locally. Color state on AWS lives **outside** the git worktree (`/opt/warcraft3sounds/state/current-color`) so `git checkout --force` cannot wipe it. |

Local and AWS share `deploy.sh` and `nginx.conf`. Ports, cert paths, and the image name are the only differences.

---

## What is not in this deploy

- Warcraft sound files (not in git, not in the CD, not in Compose volumes).
- Environment files (`.env` is gitignored; no `env.example` in the repo).
- The Node `ssl` flag in `main.cts` (self-signed inside Express). TLS is nginx-only.
