// deps

    // natives
    const { equal, deepEqual, rejects } = require("node:assert");
    const { mkdir, mkdtemp, readFile, rm } = require("node:fs/promises");
    const os = require("node:os");
    const { join } = require("node:path");

    // externals
    const { error } = require("express-openapi-validator");

    // locals
    const { "default": addToCheckFile, waitToCheckFiles } = require("../lib/cjs/server/paths/errors/tools/addToCheckFile.js");
    const { "default": pathErrorGlobal } = require("../lib/cjs/server/paths/errors/pathErrorGlobal.js");
    const { "default": getLogger, initLogger } = require("../lib/cjs/tools/getLogger.js");
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// consts

    const IPS_FILE = join(__dirname, "..", "lib", "data", "watchers", "ips.json");
    const FILENAME = "watchers-paths-to-check.txt";
    const IP_FILENAME = "watchers-ips-to-check.txt";
    const NEXT_FILENAME = "watchers-still-writes.txt";

// private

    function _wait (ms) {

        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    }

    async function _readWatchers (home, filename) {

        try {
            return await readFile(join(home, "warcraft3sounds", "logs", filename), "utf8");
        }
        catch {
            return null;
        }

    }

    async function _waitUntil (read, attempts = 50) {

        if (read() || 0 >= attempts) {
            return read();
        }

        await _wait(20);

        return _waitUntil(read, attempts - 1);

    }

    async function _watchedIp () {

        const watchers = JSON.parse(await readFile(IPS_FILE, "utf8"));

        return Object.keys(watchers[0].ips)[0];

    }

    function _req (path) {

        return {
            "method": "GET",
            "protocol": "http",
            "hostname": "127.0.0.1",
            "path": path,
            "ips": [],
            "query": {},
            "params": {}
        };

    }

    function _jsonResponse () {

        const res = {
            "headersSent": false,
            "status": (code) => {

                res.statusCode = code;

                return res;

            },
            "json": (body) => {

                res.body = body;

            }
        };

        return res;

    }

    function _ignore () {

        // the handler sends the response itself

    }

    function _captureIntrusion () {

        const logger = getLogger();
        const original = logger.error;
        const capture = {
            "seen": false,
            "restore": () => {

                logger.error = original;

            }
        };

        logger.error = (content) => {

            if ("string" === typeof content && content.startsWith("INTRUSION ATTEMPT:")) {
                capture.seen = true;
            }

            return original(content);

        };

        return capture;

    }

// tests

describe("blocked IP and request errors", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should forbid a watched IP", async () => {

        const ip = await _watchedIp();
        const res = await requestJson(ctx.baseUrl, "/api/races", {
            "X-Forwarded-For": ip
        });

        equal(res.status, 403);
        deepEqual(res.json, {
            "code": "403",
            "message": "You are not allowed to access this resource"
        });

    });

    it("should reject a notworded value that is not a boolean", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races/humans/characters/peasant?notworded=maybe");

        equal(res.status, 400);
        deepEqual(res.json, {
            "code": "400",
            "message": "request/query/notworded must be boolean"
        });

    });

    it("should return 500 after the model is released", async () => {

        await ctx.model.release();

        const res = await requestJson(ctx.baseUrl, "/api/races");

        equal(res.status, 500);
        deepEqual(res.json, {
            "code": "500",
            "message": "The database is not opened : call init() first, and do not use it after release()"
        });

    });

});

describe("pathErrorGlobal", () => {

    const originalHomedir = os.homedir;
    let home = null;

    before(async () => {

        await _wait(200);
        await waitToCheckFiles();
        await initLogger();

    });

    beforeEach(async () => {

        home = await mkdtemp(join(os.tmpdir(), "warcraft3sounds-home-"));
        os.homedir = () => {
            return home;
        };

    });

    afterEach(async () => {

        await _wait(200);
        await waitToCheckFiles();
        os.homedir = originalHomedir;
        await rm(home, {
            "recursive": true,
            "force": true
        });

    });

    it("should forward the error when the headers are already sent", () => {

        const err = new Error("already sent");
        const res = {
            "headersSent": true
        };
        let forwarded = null;

        pathErrorGlobal(err, _req("/sent"), res, (nextErr) => {

            forwarded = nextErr;

        });

        equal(forwarded, err);

    });

    it("should rewrite a bare not found message", () => {

        const err = new error.NotFound({
            "path": "/missing",
            "message": "not found"
        });
        const res = _jsonResponse();

        pathErrorGlobal(err, _req("/missing"), res, _ignore);

        equal(res.statusCode, 404);
        deepEqual(res.body, {
            "code": "404",
            "message": "\"/missing\" not found"
        });

    });

    it("should skip the IP file when a suspicious path has no IP", async () => {

        const capture = _captureIntrusion();

        try {

            const err = new error.NotFound({
                "path": "/.env",
                "message": "not found"
            });

            pathErrorGlobal(err, _req("/.env"), _jsonResponse(), _ignore);

            equal(await _waitUntil(() => {
                return capture.seen;
            }), true);
            equal(await _readWatchers(home, IP_FILENAME), null);

        }
        finally {

            capture.restore();

        }

    });

    it("should keep writing after a check file that is a directory", async () => {

        await mkdir(join(home, "warcraft3sounds", "logs", FILENAME), {
            "recursive": true
        });

        await rejects(() => {
            return addToCheckFile(FILENAME, [ "/blocked" ]);
        });

        await addToCheckFile(NEXT_FILENAME, [ "/kept" ]);

        equal(await _readWatchers(home, NEXT_FILENAME), "/kept");

    });

});
