---
name: add-watcher
description: Add attack/scan paths to lib/data/paths-watcher.json (dedupe, categorize, sort, describe). Use when the user provides suspicious paths (raw text, file, or URL) to watch.
---

# add-watcher

Adds paths to `lib/data/paths-watcher.json`: no duplicates, grouped by category, sorted, each described.

## Token budget (read this first)

- **Never read `paths-watcher.json` in full into context.** Do all dedupe/insert/sort work in a script (Node) run via Shell, and print only a short summary.
- Never echo the full input list or the full file back. Show at most 10 items when listing; otherwise counts only.
- Read inputs with a script too when large (> ~100 lines): load, normalize, print only counts + samples.
- Descriptions are written once per new category, not once per path.
- Final reply: max ~6 lines.

## 1. Input

Accept one of:

- **Raw text**: one path per line (or whitespace/comma separated) in the message.
- **File**: one path per line.
- **URL**: fetch with WebFetch, extract paths only (drop host; keep query only if meaningful).

Normalize: trim; drop empty lines and `#` comments; ensure leading `/`; keep case and leading `//` as is (significant); dedupe the input itself (exact match).

## 2. Dedupe

Skip any path already a key in **any** category's `paths` (exact, case-sensitive). Only report the count of skipped paths.

## 3. Category

The file is a JSON **array of categories**:

```json
[
  { "category": "env", "paths": { "/.env": "Description...", "...": "..." } }
]
```

- `category`: short kebab-case English id.
- `paths`: object `"path": "description"`.

Current categories, in order (keep this order):

1. `env` — `.env` files (secret leakage)
2. `git-cicd` — Git repo / CI-CD
3. `cloud-credentials` — cloud / SMTP / tool credentials (AWS, GCP, Docker, AI)
4. `wordpress` — fingerprinting, xmlrpc, plugin readme/changelog, debug.log, wp-config backup
5. `debug-info` — phpinfo / debug / Actuator
6. `config-files` — config files, sources, Docker, SQL dumps, dependency manifests
7. `product-scans` — products with known CVEs (Cisco, Fortinet, Citrix, Ivanti, SonicWall, Exchange, SharePoint...), exposed admin interfaces, nmap
8. `login-admin` — generic login/admin pages
9. `doh` — DNS over HTTPS
10. `mcp` — MCP servers
11. `phishing-bots` — phishing kits / bots
12. `webshells` — PHP webshell/backdoor probes
13. `harmless` — contact, legal, sitemap — **always last**

For each new path:

- Pick the closest existing category (match by the attacker's intent, not the extension). Within a category, reuse an existing description when the attack is the same.
- If none fits, **create a new category object** just before `harmless` (new kebab-case `category` id + paths).

## 4. Description

- Written in **French** (matches existing data), one short sentence: target (product/tech), goal (secret leak, RCE, fingerprinting...), CVE if known.
- Same style as existing: "Tentative de...", "Scan <produit> (CVE connues)", "Recherche de...".
- Specific product/CVE => specific description, e.g. `Scan Atlassian Confluence (CVE-2023-22515)`.
- Never empty or generic ("suspect"). If unsure what a path targets, WebSearch rather than guess.

## 5. Sort

Two levels: **category > alphabetical**.

- Category order is fixed as above (new category goes before `harmless`).
- Within each `paths` object, sort keys by **ordinal** code-point order (`a < b` in JS, not `localeCompare`): `/.env` < `/.env.bak`, uppercase before lowercase, `//` before `/a`.
- Re-sort the whole touched `paths` object, not only the additions.

## 6. Write

Use a Node script: `JSON.parse` the file, mutate, sort, then `fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n")` (UTF-8, 2-space indent, final newline). Do not touch untouched categories. Beware PowerShell encoding: write the script with the Write tool, not here-strings, and use \u escapes for accents.

## 7. Verify (script, silent on success)

1. `JSON.parse` succeeds and the root is an array of `{ category: string, paths: object }`.
2. No path appears twice across categories; no duplicate `category` ids.
3. Each `paths` object is sorted.

Print only `OK` or the error.

## 8. If the input was a file

After a successful run:
- For any input file, **offer to delete it** at the end of the reply (one short question, e.g. via AskQuestion: delete / keep). Never delete without confirmation.

## 9. Output

Reply with at most a few lines:

- `added N, skipped M (already present), unclassified K`
- per-category counts, and any **new category + its description**.
- If the input was a file: ask whether to delete it.
