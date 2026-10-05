#!/usr/bin/env node

"use strict";

// Applies classification rules to the pending paths and updates lib/data/watchers/paths.json.
//
// usage : node apply.js <source> <rules.json> [--dry] [--clean]
//   source   : url, file or raw text (same as extract.js, mandatory)
//   rules    : JSON array of { "category": "id", "description": "...", "paths": ["/a"], "match": "regex" }
//              ("paths" and/or "match" ; first matching rule wins ; unmatched paths are left untouched)
//   --dry    : do not write anything
//   --clean  : remove the added paths from the source (file only)

const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const WATCHER_FILE = join(__dirname, "..", "..", "..", "lib", "data", "watchers", "paths.json");
const LAST_CATEGORY = "harmless";
const SAMPLES = 10;

const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;

const { extract } = require("./extract");

async function main () {

    const args = process.argv.slice(2);
    const flags = args.filter((a) => a.startsWith("--"));
    const [ source, rulesFile ] = args.filter((a) => !a.startsWith("--"));

    if (!source || !rulesFile) {
        throw new Error("usage: apply.js <source> <rules.json> [--dry] [--clean]");
    }

    const { kind, "paths": pending, skipped } = await extract(source);

    const data = JSON.parse(readFileSync(WATCHER_FILE, "utf8"));

    const rules = JSON.parse(readFileSync(rulesFile, "utf8")).map((r) => ({
        ...r,
        "set": new Set(r.paths ?? []),
        "re": r.match ? new RegExp(r.match) : null
    }));

    const counts = {};
    const created = [];
    const added = new Set();
    const unclassified = [];

    for (const path of pending) {

        const rule = rules.find((r) => r.set.has(path) || r.re?.test(path));

        if (!rule) {
            unclassified.push(path); continue;
        }

        if (!rule.category || !rule.description) {
            throw new Error("rule without category/description: " + JSON.stringify(rule.category));
        }

        let cat = data.find((c) => c.category === rule.category);

        if (!cat) {

            cat = { "category": rule.category, "paths": {} };
            const last = data.findIndex((c) => c.category === LAST_CATEGORY);
            data.splice(-1 === last ? data.length : last, 0, cat);
            created.push(rule.category + " => " + rule.description);

        }

        cat.paths[path] = rule.description;
        counts[rule.category] = (counts[rule.category] ?? 0) + 1;
        added.add(path);

    }

    // sort touched categories (ordinal)
    for (const cat of data) {

        if (counts[cat.category]) {
            cat.paths = Object.fromEntries(Object.entries(cat.paths).sort((a, b) => ord(a[0], b[0])));
        }

    }

    // verify
    const all = data.flatMap((c) => Object.keys(c.paths));

    if (new Set(all).size !== all.length) {
        throw new Error("duplicate path");
    }

    if (new Set(data.map((c) => c.category)).size !== data.length) {
        throw new Error("duplicate category");
    }

    if (!flags.includes("--dry")) {

        writeFileSync(WATCHER_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

        if (flags.includes("--clean") && "file" === kind) {

            const kept = readFileSync(source, "utf8").split(/\r?\n/).filter((l) => !added.has(l.trim().startsWith("/") ? l.trim() : "/" + l.trim()));
            writeFileSync(source, kept.join("\n"), "utf8");

        }

    }

    const out = [ "added " + added.size + ", skipped " + skipped + ", unclassified " + unclassified.length + (flags.includes("--dry") ? " (dry)" : "") ];

    out.push(Object.entries(counts).map(([ k, v ]) => k + ":" + v).join(" "));
    created.forEach((c) => out.push("new category " + c));

    if (unclassified.length) {
        out.push("unclassified: " + unclassified.slice(0, SAMPLES).join(" ") + (unclassified.length > SAMPLES ? " ..." : ""));
    }

    process.stdout.write(out.join("\n") + "\n");

}

main().catch((err) => {
    process.stderr.write(err.message + "\n"); process.exitCode = 1;
});
