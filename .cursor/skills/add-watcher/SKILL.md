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

Skip any path already a key in the JSON (exact, case-sensitive). Only report the count of skipped paths.

## 3. Category

The file is a flat `"path": "description"` object. **Categories are blocks separated by a blank line**, all entries of a block sharing one identical description. Block order:

1. `.env` files (secret leakage)
2. Git repo / CI-CD
3. Cloud / SMTP / tool credentials (AWS, GCP, Docker, AI)
4. WordPress (fingerprinting, xmlrpc, plugin readme/changelog, debug.log, wp-config backup)
5. phpinfo / debug / Actuator
6. Config files, sources, Docker, SQL dumps, dependency manifests
7. Product scans with known CVEs (Cisco, Fortinet, Citrix, Ivanti, SonicWall, Exchange, SharePoint...)
8. Generic login/admin pages
9. DoH (DNS over HTTPS)
10. MCP
11. Phishing kits / bots
12. Harmless (contact, legal, sitemap) — **always last**

For each new path:

- Pick the closest existing block (match by the attacker's intent, not the extension) and **reuse its exact description**.
- If none fits, **create a new block** just before the "harmless" block with a new description. Example: unknown PHP files, file managers, uploads dirs => "Search for PHP webshell/backdoor dropped by a previous attacker".

## 4. Description

- Written in **French** (matches existing data), one short sentence: target (product/tech), goal (secret leak, RCE, fingerprinting...), CVE if known.
- Same style as existing: "Tentative de...", "Scan <produit> (CVE connues)", "Recherche de...".
- Specific product/CVE => specific description, e.g. `Scan Atlassian Confluence (CVE-2023-22515)`.
- Never empty or generic ("suspect"). If unsure what a path targets, WebSearch rather than guess.

## 5. Sort

Two levels: **category > alphabetical**.

- Category order is fixed as above (new block goes before "harmless").
- Within a block, sort keys by **ordinal** code-point order (`a < b` in JS, not `localeCompare`). This reproduces the existing order (`/.env` < `/.env.bak`, uppercase before lowercase, `//` before `/a`).
- Re-sort the whole touched block, not only the additions.

## 6. Write

Preserve the exact format:

- `{`, blank line, then entries one per line with 2-space indent: `  "/path": "Description",`
- One blank line between categories, one blank line before `}`.
- Comma after every entry except the very last one of the file.
- Proper JSON escaping; keep UTF-8 accents.
- Do not touch untouched blocks.

`JSON.parse` loses blank lines, so the script must parse the file **by blocks** (split on blank lines, keep each block's entries and description), insert/sort per block, then re-serialize with the format above.

## 7. Verify (script, silent on success)

1. `JSON.parse` succeeds.
2. No duplicate keys (count of key lines in text == `Object.keys(parsed).length`).
3. Each block sorted.

Print only `OK` or the error.

## 8. If the input was a file

After a successful run:
- For any input file, **offer to delete it** at the end of the reply (one short question, e.g. via AskQuestion: delete / keep). Never delete without confirmation.

## 9. Output

Reply with at most a few lines:

- `added N, skipped M (already present), unclassified K`
- per-category counts, and any **new category + its description**.
- If the input was a file: ask whether to delete it.
