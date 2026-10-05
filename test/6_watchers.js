// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const os = require("node:os");
    const { mkdtemp, readFile, rm } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const { "default": addToCheckFile, waitToCheckFiles } = require("../lib/cjs/server/paths/errors/tools/addToCheckFile.js");
    const { "default": extractIps } = require("../lib/cjs/tools/extractIps.js");
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// consts

    const FILENAME = "watchers-paths-to-check.txt";
    const IP_FILENAME = "watchers-ips-to-check.txt";

// private

    function _wait (ms) {

        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    }

    async function _readWatchers (home, filename = FILENAME) {

        try {
            return await readFile(join(home, "warcraft3sounds", "logs", filename), "utf8");
        }
        catch {
            return null;
        }

    }

    // the file is written after the response : wait until it satisfies the expected content
    async function _waitForWatchers (home, expected, attempts = 50, filename = FILENAME) {

        const content = await _readWatchers(home, filename);

        if (expected === content || 0 >= attempts) {
            return content;
        }

        await _wait(20);

        return _waitForWatchers(home, expected, attempts - 1, filename);

    }

// tests

describe("watchers-to-check files", () => {

    const originalHomedir = os.homedir;
    let home = null;

    // the previous test files record their own 404 in the background : let them finish
    // before the home directory is replaced, or their write would land in the temporary one
    before(async () => {

        await _wait(200);
        await waitToCheckFiles();

    });

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

    describe("addToCheckFile", () => {

        it("should create the file with the value", async () => {

            await addToCheckFile(FILENAME, [ "/a" ]);

            equal(await _readWatchers(home), "/a");

        });

        it("should not add a duplicate", async () => {

            await addToCheckFile(FILENAME, [ "/a" ]);
            await addToCheckFile(FILENAME, [ "/a", "/a" ]);

            equal(await _readWatchers(home), "/a");

        });

        it("should sort the values alphabetically, separated by \\n", async () => {

            await addToCheckFile(FILENAME, [ "/c" ]);
            await addToCheckFile(FILENAME, [ "/a", "/b" ]);

            equal(await _readWatchers(home), "/a\n/b\n/c");

        });

        it("should keep every value with concurrent calls", async () => {

            await Promise.all([
                "/d", "/b", "/a", "/c", "/b"
            ].map((value) => {
                return addToCheckFile(FILENAME, [ value ]);
            }));

            equal(await _readWatchers(home), "/a\n/b\n/c\n/d");

        });

        it("should record the IPs in their own file", async () => {

            await addToCheckFile(IP_FILENAME, [
 "5.6.7.8", "1.2.3.4", "5.6.7.8"
]);

            equal(await _readWatchers(home, IP_FILENAME), "1.2.3.4\n5.6.7.8");
            equal(await _readWatchers(home), null);

        });

    });

    describe("addToCheckFile limit", () => {

        it("should not grow beyond the maximum number of entries", async () => {

            const values = Array.from({ "length": 1100 }, (_, index) => {
                return "/p" + String(index).padStart(4, "0");
            });

            await addToCheckFile(FILENAME, values);
            await addToCheckFile(FILENAME, [ "/new" ]);

            const lines = (await _readWatchers(home)).split("\n");

            equal(1000, lines.length);
            equal(false, lines.includes("/new"));

        });

    });

    describe("extractIps", () => {

        it("should drop values that are not IP addresses", () => {

            deepEqual(extractIps({
                "ips": [
 "garbage", "1.2.3.4", "<script>", ""
],
                "ip": "not-an-ip"
            }), [ "1.2.3.4" ]);

        });

        it("should merge mapped IPv6 and IPv4 in one entry", () => {

            deepEqual(extractIps({
                "ips": [ "::ffff:1.2.3.4" ],
                "ip": "1.2.3.4"
            }), [ "1.2.3.4" ]);

        });

        it("should keep real IPv6", () => {

            deepEqual(extractIps({
                "ips": [],
                "ip": "2001:db8::1"
            }), [ "2001:db8::1" ]);

        });

        it("should cap the number of IPs", () => {

            const ips = Array.from({ "length": 20 }, (_, index) => {
                return "10.0.0." + String(index + 1);
            });

            equal(5, extractIps({
                ips,
                "ip": ips[0]
            }).length);

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

        it("should record the path and not the IP for an unknown path", async () => {

            const res = await requestJson(ctx.baseUrl, "/zz-unknown");

            equal(res.status, 404);
            equal(await _waitForWatchers(home, "/zz-unknown"), "/zz-unknown");
            equal(await _readWatchers(home, IP_FILENAME), null);

        });

        it("should not record a suspicious path", async () => {

            const res = await requestJson(ctx.baseUrl, "/.env");

            equal(res.status, 404);

            // a not suspicious path afterwards proves that the previous one had its chance to be written
            await requestJson(ctx.baseUrl, "/zz-unknown");

            deepEqual(await _waitForWatchers(home, "/zz-unknown"), "/zz-unknown");

        });

        it("should record the IP and not the path for a suspicious path", async () => {

            const res = await requestJson(ctx.baseUrl, "/.env");

            equal(res.status, 404);

            const ips = await _waitForWatchers(home, "127.0.0.1", 50, IP_FILENAME);

            equal(ips.endsWith("127.0.0.1"), true);
            equal(await _readWatchers(home), null);

        });

    });

});
