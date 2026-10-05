#!/usr/bin/env node

"use strict";

// Lists the paths and the IPs of a source that are not yet in lib/data/watchers/paths.json / ips.json, sorted alphabetically.
// A line starting with "/" is a path, a line that is an IP address (v4 or v6) is an IP.
//
// usage : node extract.js <source>      (source is mandatory)
//   source : an URL (http/https, simple GET), a file path, or raw text (paths and IPs separated by newlines, spaces or commas)

// deps

    // natives
    const { existsSync, readFileSync, statSync } = require("node:fs");
    const { isIP } = require("node:net");
    const { join } = require("node:path");

// consts

    const DATA_DIR = join(__dirname, "..", "..", "..", "lib", "data", "watchers");
    const PATHS_FILE = join(DATA_DIR, "paths.json");
    const IPS_FILE = join(DATA_DIR, "ips.json");
    const IPV4_MAPPED_PREFIX = "::ffff:";

// private

    function _isFile (source) {

        try {
            return existsSync(source) && statSync(source).isFile();
        }
        catch {
            return false;
        }

    }

    // "::ffff:1.2.3.4" (IPv4-mapped IPv6) => "1.2.3.4", IPv6 in lower case
    function _normalizeIp (token) {

        const ip = token.toLowerCase();

        return ip.startsWith(IPV4_MAPPED_PREFIX) && 4 === isIP(ip.slice(IPV4_MAPPED_PREFIX.length)) ? ip.slice(IPV4_MAPPED_PREFIX.length) : ip;

    }

    function _ord (a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    function _readList (file, key) {

        try {
            return JSON.parse(readFileSync(file, "utf8")).flatMap((category) => Object.keys(category[key]));
        }
        catch (err) {

            if ("ENOENT" === err.code) {
                return [];
            }

            throw err;

        }

    }

// module

    // token => { "type": "ips" | "paths", "value": string } (null if empty)
    function normalize (token) {

        if (isIP(token)) {
            return { "type": "ips", "value": _normalizeIp(token) };
        }

        // full URL => path (+ query)
        if (/^https?:\/\//i.test(token)) {

            try {
                const url = new URL(token);

                return { "type": "paths", "value": url.pathname + url.search };
            }
            catch {
                return null;
            }

        }

        return token ? { "type": "paths", "value": token.startsWith("/") ? token : "/" + token } : null;

    }

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
        return new Set(_readList(PATHS_FILE, "paths"));
    }

    function knownIps () {
        return new Set(_readList(IPS_FILE, "ips"));
    }

    // all the normalized, deduped paths and IPs of a content
    function parse (content) {

        const tokens = content.split(/\r?\n/).filter((line) => !line.trim().startsWith("#")).join("\n").split(/[\s,]+/);
        const entries = tokens.filter(Boolean).map(normalize).filter(Boolean);

        return {
            "paths": [ ...new Set(entries.filter((e) => "paths" === e.type).map((e) => e.value)) ],
            "ips": [ ...new Set(entries.filter((e) => "ips" === e.type).map((e) => e.value)) ]
        };

    }

    // new paths and IPs (not already watched), sorted
    async function extract (source) {

        const { kind, content } = await read(source);
        const all = parse(content);
        const knownP = knownPaths();
        const knownI = knownIps();

        const paths = all.paths.filter((path) => !knownP.has(path)).sort(_ord);
        const ips = all.ips.filter((ip) => !knownI.has(ip)).sort(_ord);

        return { kind, paths, ips, "skipped": all.paths.length + all.ips.length - paths.length - ips.length };

    }

async function main () {

    const source = process.argv[2];

    if (!source) {
        throw new Error("source is required (url, file or text)");
    }
    else {

        return extract(source).then(({ paths, ips }) => {

            const lines = [ ...paths, ...ips ];

            if (lines.length) {
                process.stdout.write(lines.join("\n") + "\n");
            }

        });

    }

}

if (require.main === module) {

    main().catch((err) => {
        process.stderr.write(err.message + "\n"); process.exitCode = 1;
    });

}
else {

    module.exports = { extract, normalize };

}
