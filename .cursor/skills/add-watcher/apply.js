#!/usr/bin/env node

"use strict";

// Applies classification rules to the pending paths and IPs and updates lib/data/watchers/paths.json and ips.json.
//
// usage : node apply.js <source> <rules.json> [--dry] [--clean]
//   source   : url, file or raw text (same as extract.js, mandatory)
//   rules    : JSON array of { "category": "id", "description": "...", "type": "paths" | "ips", "paths": ["/a"], "ips": ["1.2.3.4"], "match": "regex" }
//              ("type" defaults to "paths" ; "paths"/"ips" and/or "match" ; first matching rule of the right type wins ;
//               unmatched entries are left untouched)
//   --dry    : do not write anything
//   --clean  : remove the added paths and IPs from the source (file only)

const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const DATA_DIR = join(__dirname, "..", "..", "..", "lib", "data", "watchers");
const TYPES = {
    "paths": { "file": join(DATA_DIR, "paths.json"), "last": "harmless" },
    "ips": { "file": join(DATA_DIR, "ips.json"), "last": null }
};
const SAMPLES = 10;

const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;

const { extract, normalize } = require("./extract");

function load (type) {

    try {
        return JSON.parse(readFileSync(TYPES[type].file, "utf8"));
    }
    catch (err) {

        if ("ENOENT" === err.code) {
            return [];
        }

        throw err;

    }

}

// classifies the pending entries of a type into its data, returns the report
function classify (type, pending, rules, data) {

    const report = { "counts": {}, "created": [], "added": new Set(), "unclassified": [] };

    for (const value of pending) {

        const rule = rules.find((r) => r.type === type && (r.set.has(value) || r.re?.test(value)));

        if (!rule) {
            report.unclassified.push(value); continue;
        }

        if (!rule.category || !rule.description) {
            throw new Error("rule without category/description: " + JSON.stringify(rule.category));
        }

        let cat = data.find((c) => c.category === rule.category);

        if (!cat) {

            cat = { "category": rule.category, [type]: {} };
            const last = null === TYPES[type].last ? -1 : data.findIndex((c) => c.category === TYPES[type].last);
            data.splice(-1 === last ? data.length : last, 0, cat);
            report.created.push(type + "/" + rule.category + " => " + rule.description);

        }

        cat[type][value] = rule.description;
        report.counts[rule.category] = (report.counts[rule.category] ?? 0) + 1;
        report.added.add(value);

    }

    // sort touched categories (ordinal)
    for (const cat of data) {

        if (report.counts[cat.category]) {
            cat[type] = Object.fromEntries(Object.entries(cat[type]).sort((a, b) => ord(a[0], b[0])));
        }

    }

    // verify
    const all = data.flatMap((c) => Object.keys(c[type]));

    if (new Set(all).size !== all.length) {
        throw new Error("duplicate " + type);
    }

    if (new Set(data.map((c) => c.category)).size !== data.length) {
        throw new Error("duplicate category (" + type + ")");
    }

    return report;

}

async function main () {

    const args = process.argv.slice(2);
    const flags = args.filter((a) => a.startsWith("--"));
    const [ source, rulesFile ] = args.filter((a) => !a.startsWith("--"));

    if (!source || !rulesFile) {
        throw new Error("usage: apply.js <source> <rules.json> [--dry] [--clean]");
    }

    const { kind, paths, ips, skipped } = await extract(source);

    const rules = JSON.parse(readFileSync(rulesFile, "utf8")).map((r) => {

        const type = r.type ?? "paths";

        if (!TYPES[type]) {
            throw new Error("unknown rule type: " + type);
        }

        return { ...r, type, "set": new Set(r[type] ?? []), "re": r.match ? new RegExp(r.match) : null };

    });

    const pending = { paths, ips };
    const data = { "paths": load("paths"), "ips": load("ips") };
    const reports = {};
    const added = new Set();

    for (const type of Object.keys(TYPES)) {

        reports[type] = classify(type, pending[type], rules, data[type]);
        reports[type].added.forEach((value) => added.add(value));

    }

    if (!flags.includes("--dry")) {

        for (const type of Object.keys(TYPES)) {

            if (reports[type].added.size) {
                writeFileSync(TYPES[type].file, JSON.stringify(data[type], null, 2) + "\n", "utf8");
            }

        }

        if (flags.includes("--clean") && "file" === kind) {

            const kept = readFileSync(source, "utf8").split(/\r?\n/).filter((l) => !added.has(normalize(l.trim())?.value));
            writeFileSync(source, kept.join("\n"), "utf8");

        }

    }

    const unclassified = Object.values(reports).flatMap((r) => r.unclassified);
    const out = [ "added " + added.size + ", skipped " + skipped + ", unclassified " + unclassified.length + (flags.includes("--dry") ? " (dry)" : "") ];

    for (const type of Object.keys(TYPES)) {

        out.push(type + ": " + (Object.entries(reports[type].counts).map(([ k, v ]) => k + ":" + v).join(" ") || "-"));
        reports[type].created.forEach((c) => out.push("new category " + c));

    }

    if (unclassified.length) {
        out.push("unclassified: " + unclassified.slice(0, SAMPLES).join(" ") + (unclassified.length > SAMPLES ? " ..." : ""));
    }

    process.stdout.write(out.join("\n") + "\n");

}

main().catch((err) => {
    process.stderr.write(err.message + "\n"); process.exitCode = 1;
});
