#!/usr/bin/env node

"use strict";

// Lists the paths of a source that are not yet in lib/data/paths-watcher.json, sorted alphabetically.
//
// usage : node extract.js <source>      (source is mandatory)
//   source : an URL (http/https, simple GET), a file path, or raw text (paths separated by newlines, spaces or commas)

// deps

    // natives
    const { existsSync, readFileSync, statSync } = require("node:fs");
    const { join } = require("node:path");

// consts

    const WATCHER_FILE = join(__dirname, "..", "..", "..", "lib", "data", "paths-watcher.json");

// private

    function _isFile (source) {

        try {
            return existsSync(source) && statSync(source).isFile();
        }
        catch {
            return false;
        }

    }

    function _toPath (token) {

        // full URL => path (+ query)
        if (/^https?:\/\//i.test(token)) {

            try {
                const url = new URL(token); return url.pathname + url.search;
            }
            catch {
                return "";
            }

        }

        return token.startsWith("/") ? token : "/" + token;

    }

    function _ord (a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

// module

    // returns the content and the kind of the source
    async function read (source) {

        if (/^https?:\/\//i.test(source) && !/\s/.test(source)) {

            const res = await fetch(source);

            if (!res.ok) {
                throw new Error("GET " + source + " => " + res.status);
            }

            return { "kind": "url", "content": await res.text() };

        }

        if (_isFile(source)) {
            return { "kind": "file", "content": readFileSync(source, "utf8") };
        }

        return { "kind": "text", "content": source };

    }

    function knownPaths () {

        return new Set(JSON.parse(readFileSync(WATCHER_FILE, "utf8")).flatMap((category) => Object.keys(category.paths)));

    }

    // all the normalized, deduped paths of a content
    function parse (content) {

        const tokens = content.split(/\r?\n/).filter((line) => !line.trim().startsWith("#")).join("\n").split(/[\s,]+/);

        return [ ...new Set(tokens.filter(Boolean).map(_toPath).filter(Boolean)) ];

    }

    // new paths (not already watched), sorted
    async function extract (source) {

        const { kind, content } = await read(source);
        const all = parse(content);
        const known = knownPaths();
        const paths = all.filter((path) => !known.has(path)).sort(_ord);

        return { kind, "total": all.length, paths, "skipped": all.length - paths.length };

    }

async function main () {

    const source = process.argv[2];

    if (!source) {
        throw new Error("source is required (url, file or text)");
    }
    else {

        return extract(source).then(({ paths }) => {

            if (paths.length) {
                process.stdout.write(paths.join("\n") + "\n");
            }

        });

    }

}

main().catch((err) => {
    process.stderr.write(err.message + "\n"); process.exitCode = 1;
});
