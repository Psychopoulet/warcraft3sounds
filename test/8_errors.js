// deps

    // natives
    const { equal, deepEqual, rejects } = require("node:assert");
    const { mkdir, mkdtemp, readFile, rename, rm } = require("node:fs/promises");
    const os = require("node:os");
    const { join } = require("node:path");

    // externals
    const { error } = require("express-openapi-validator");

    // locals
    const { "default": addToCheckFile, waitToCheckFiles } = require("../lib/src/server/paths/errors/tools/addToCheckFile.ts");
    const { "default": pathErrorGlobal } = require("../lib/src/server/paths/errors/pathErrorGlobal.ts");
    const { "default": getLogger, initLogger } = require("../lib/src/tools/getLogger.ts");
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// consts

    const IPS_FILE = join(__dirname, "..", "lib", "data", "watchers", "ips.json");
    const PATHS_FILE = join(__dirname, "..", "lib", "data", "watchers", "paths.json");
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

    function _withoutStack (err) {

        err.stack = null;

        return err;

    }

    function _captureErrors () {

        const logger = getLogger();
        const original = logger.error;
        const messages = [];

        logger.error = (content) => {

            messages.push(content);

            return original(content);

        };

        return {
            "messages": messages,
            "restore": () => {

                logger.error = original;

            }
        };

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

    it("should log a managed error that has no stack", () => {

        const badRequest = _withoutStack(new error.BadRequest({
            "path": "/bad",
            "message": "bad input"
        }));
        const internal = _withoutStack(new Error("boom"));
        const badResponse = _jsonResponse();
        const internalResponse = _jsonResponse();

        pathErrorGlobal(badRequest, _req("/bad"), badResponse, _ignore);
        pathErrorGlobal(internal, _req("/boom"), internalResponse, _ignore);

        equal(badResponse.statusCode, 400);
        equal(badResponse.body.message, "bad input");
        equal(internalResponse.statusCode, 500);
        equal(internalResponse.body.message, "boom");

    });

    it("should keep logging when a suspicious path cannot record its IP", async () => {

        const capture = _captureErrors();
        const req = _req("/.env");

        req.ip = "8.8.8.8";

        try {

            await mkdir(join(home, "warcraft3sounds", "logs", IP_FILENAME), {
                "recursive": true
            });

            pathErrorGlobal(new error.NotFound({
                "path": "/.env",
                "message": "not found"
            }), req, _jsonResponse(), _ignore);

            equal(await _waitUntil(() => {
                return capture.messages.some((message) => {
                    return message.includes("EISDIR") || message.includes("EPERM");
                });
            }), true);

        }
        finally {

            capture.restore();

        }

    });

    it("should keep logging when an unknown path cannot be recorded", async () => {

        const capture = _captureErrors();

        try {

            await mkdir(join(home, "warcraft3sounds", "logs", FILENAME), {
                "recursive": true
            });

            pathErrorGlobal(new error.NotFound({
                "path": "/zz-unknown",
                "message": "not found"
            }), _req("/zz-unknown"), _jsonResponse(), _ignore);

            equal(await _waitUntil(() => {
                return capture.messages.some((message) => {
                    return message.includes("EISDIR") || message.includes("EPERM");
                });
            }), true);

        }
        finally {

            capture.restore();

        }

    });

    it("should log when the watcher file cannot be read", async () => {

        const capture = _captureErrors();
        const hidden = join(os.tmpdir(), "warcraft3sounds-paths-aside.json");

        await rename(PATHS_FILE, hidden);

        try {

            pathErrorGlobal(new error.NotFound({
                "path": "/zz-unknown",
                "message": "not found"
            }), _req("/zz-unknown"), _jsonResponse(), _ignore);

            equal(await _waitUntil(() => {
                return capture.messages.some((message) => {
                    return message.includes("ENOENT");
                });
            }), true);

        }
        finally {

            capture.restore();
            await rename(hidden, PATHS_FILE);

        }

    });

});
