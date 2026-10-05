---
name: add-watcher
description: Add attack/scan paths and fraudulent IPs to lib/data/watchers/paths.json and ips.json (dedupe, categorize, sort, describe). Use when the user provides suspicious paths or IPs (raw text, file, or URL) to watch.
---

# add-watcher

Adds paths to `lib/data/watchers/paths.json` (array of `{ "category", "paths": { "/path": "description" } }`) and IPs to `lib/data/watchers/ips.json` (array of `{ "category", "ips": { "1.2.3.4": "description" } }`). A pending entry that is an IP address (v4 or v6) is an IP, anything else is a path. Dedupe, sort and writing are done by scripts: **you only classify.**

## Token rules

- **Never read `paths.json` or `ips.json`.** Never echo input lists or the files back.
- Classify with **regex rules** (`match`) rather than listing paths one by one; list explicit `paths` only for exceptions.
- One description per rule, not per path.
- Final reply: max ~6 lines.

## Workflow

1. **Get the pending paths and IPs** (already normalized, deduped, not in the JSON, sorted; paths start with `/`, IPs are bare addresses, `::ffff:` IPv4-mapped IPv6 is turned into IPv4):
   `node .cursor/skills/add-watcher/extract.js "<source>"` — the source is mandatory (fails without) and auto-detected: **URL** (simple GET), existing **file**, otherwise **raw text** (paths separated by newlines/spaces/commas). No need to fetch or read it yourself.
   - If the output is empty, reply "nothing to add" and stop.
2. **Write `rules.json`** (temp dir, with the Write tool; use `\uXXXX` for accents):
   ```json
   [
     { "category": "webshells", "description": "Recherche de webshell/backdoor PHP déposé par un attaquant précédent", "match": "\\.php$" },
     { "category": "product-scans", "description": "Scan nmap (détection de services HTTP)", "paths": ["/nmaplowercheck1791007888"] },
     { "category": "scanners", "description": "Scanner de vulnérabilités connu", "type": "ips", "match": "^45\\.137\\." },
     { "category": "bruteforce", "description": "Tentatives de brute force répétées", "type": "ips", "ips": ["203.0.113.7"] }
   ]
   ```
   `type` is `"paths"` (default) or `"ips"`: a rule only applies to entries of its type, with its own categories (`ips.json` has none in common with `paths.json`). First matching rule wins, so put specific rules (`paths`/`ips`, narrow regex) before broad ones.
3. **Apply**: `node .cursor/skills/add-watcher/apply.js "<source>" <rules.json> [--clean]`
   - Same `<source>` as step 1. Add `--dry` first if unsure. `--clean` removes added lines from the source (file only).
   - It dedupes, creates missing categories (paths: before `harmless`; IPs: appended), sorts touched categories, verifies, writes, and prints a short summary (one line per type).
4. If some paths or IPs are `unclassified`, add rules for them and re-run (already-added entries are skipped).
5. **Reply** in a few lines: `added N, skipped M, unclassified K`, per-category counts, new categories + description.
6. If the input was a file: ask (AskQuestion: delete / keep) whether to delete it. Delete only after confirmation; with `watcher-notpatched.txt`, only offer deletion once empty.

## Categories (keep order; `harmless` always last)

`env` (.env secret leaks) · `git-cicd` · `cloud-credentials` (AWS, GCP, Docker, SMTP, AI tools) · `wordpress` (fingerprinting, xmlrpc, plugin readme/changelog, debug.log, directory listing) · `debug-info` (phpinfo, Actuator) · `config-files` (config, sources, Docker, SQL dumps, dependency manifests) · `product-scans` (known-CVE products: Cisco, Fortinet, Citrix, Ivanti, SonicWall, Exchange..., exposed admin interfaces, nmap) · `login-admin` (generic login/admin pages) · `doh` · `mcp` · `phishing-bots` · `webshells` (PHP webshell/backdoor probes) · `harmless` (contact, legal, sitemap, robots).

- Choose by the attacker's intent, not the extension.
- If none fits, use a new kebab-case English `category` id: the script creates it before `harmless`.
- Within a category, reuse the existing description when the attack is the same.

### IP categories (`ips.json`, free order)

No fixed list: pick by the attacker's behavior, e.g. `scanners` (vulnerability/port scanners), `bruteforce`, `webshell-probes`, `bots` (abusive crawlers), `cloud-abusers`. If none fits, use a new kebab-case English `category` id: the script creates it. Prefer regex on prefixes (`^45\\.137\\.`) for a whole range only when you are sure it is one actor; otherwise list the IPs.

## Descriptions

French, one short sentence: target, goal, CVE if known. Style: "Tentative de...", "Scan <produit> (CVE connues)", "Recherche de...". Be specific for a known product/CVE (e.g. `Scan Atlassian Confluence (CVE-2023-22515)`). Never empty or generic. If unsure what a path targets, WebSearch rather than guess. For an IP: its behavior or owner (e.g. `Scanner Shodan`, `Scan massif de .env depuis un hébergeur`), never an invented attribution.
