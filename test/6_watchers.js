// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const os = require("node:os");
    const { mkdtemp, readFile, rm, writeFile } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const addWatcherToCheck = require("../lib/cjs/server/paths/errors/tools/addWatcherToCheck.js").default;
    const ipWatcher = require("../lib/cjs/server/paths/errors/tools/ipWatcher.js").default;
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// consts

    const FILENAME = "watchers-to-check.txt";

// private

    function _wait (ms) {

        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    }

    async function _readWatchers (home) {

        try {
            return await readFile(join(home, "warcraft3sounds", "logs", FILENAME), "utf8");
        }
        catch {
            return null;
        }

    }

    // the file is written after the response : wait until it satisfies the expected content
    async function _waitForWatchers (home, expected, attempts = 50) {

        const content = await _readWatchers(home);

        if (expected === content || 0 >= attempts) {
            return content;
        }

        await _wait(20);

        return _waitForWatchers(home, expected, attempts - 1);

    }

// tests

describe("watchers-to-check", () => {

    const originalHomedir = os.homedir;
    let home = null;

    // the logs directory is built from the home directory : point it to a temporary one
    beforeEach(async () => {

        home = await mkdtemp(join(os.tmpdir(), "warcraft3sounds-home-"));
        os.homedir = () => {
            return home;
        };

    });

    afterEach(async () => {

        os.homedir = originalHomedir;
        await rm(home, {
            "recursive": true,
            "force": true
        });

    });

    describe("addWatcherToCheck", () => {

        it("should create the file with the path", async () => {

            await addWatcherToCheck("/a");

            equal(await _readWatchers(home), "/a");

        });

        it("should not add a duplicate", async () => {

            await addWatcherToCheck("/a");
            await addWatcherToCheck("/a");

            equal(await _readWatchers(home), "/a");

        });

        it("should sort the paths alphabetically, separated by \\n", async () => {

            await addWatcherToCheck("/c");
            await addWatcherToCheck("/a");
            await addWatcherToCheck("/b");

            equal(await _readWatchers(home), "/a\n/b\n/c");

        });

        it("should keep every path with concurrent calls", async () => {

            await Promise.all([
                "/d", "/b", "/a", "/c", "/b"
            ].map(addWatcherToCheck));

            equal(await _readWatchers(home), "/a\n/b\n/c\n/d");

        });

    });

    describe("ipWatcher", () => {

        let file = null;

        beforeEach(async () => {

            file = join(home, "ip-watcher.json");

            await writeFile(file, JSON.stringify([
                {
                    "category": "scanners",
                    "ips": {
                        "1.2.3.4": "known scanner"
                    }
                }
            ]), "utf8");

        });

        it("should flag a listed IP", async () => {

            deepEqual(await ipWatcher("1.2.3.4", file), {
                "isSuspicious": true,
                "description": "known scanner"
            });

        });

        it("should not flag an unlisted IP", async () => {

            deepEqual(await ipWatcher("5.6.7.8", file), {
                "isSuspicious": false
            });

        });

        it("should flag a listed IP given as an IPv4-mapped IPv6", async () => {

            deepEqual(await ipWatcher("::ffff:1.2.3.4", file), {
                "isSuspicious": true,
                "description": "known scanner"
            });

        });

        it("should not flag anything with the default (empty) list", async () => {

            deepEqual(await ipWatcher("1.2.3.4"), {
                "isSuspicious": false
            });

        });

    });

    describe("not found requests", () => {

        let ctx = null;

        beforeEach(async () => {

            ctx = await startHttpTest();

        });

        afterEach(async () => {

            if (ctx) {
                await stopHttpTest(ctx);
            }

        });

        it("should record a not suspicious path", async () => {

            const res = await requestJson(ctx.baseUrl, "/zz-unknown");

            equal(res.status, 404);
            equal(await _waitForWatchers(home, "/zz-unknown"), "/zz-unknown");

        });

        it("should not record a suspicious path", async () => {

            const res = await requestJson(ctx.baseUrl, "/.env");

            equal(res.status, 404);

            // a not suspicious path afterwards proves that the previous one had its chance to be written
            await requestJson(ctx.baseUrl, "/zz-unknown");

            deepEqual(await _waitForWatchers(home, "/zz-unknown"), "/zz-unknown");

        });

    });

});
