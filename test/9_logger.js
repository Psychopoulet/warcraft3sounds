/* eslint-disable n/no-process-env */
// n/no-process-env : the production logger is selected from NODE_ENV

// deps

    // natives
    const { equal, ok, rejects, throws } = require("node:assert");
    const { createServer } = require("node:http");
    const { mkdtemp, readdir, readFile, rm } = require("node:fs/promises");
    const os = require("node:os");
    const { join } = require("node:path");

    // externals
    const winston = require("winston");

    // locals
    const { "default": closeServer } = require("../lib/cjs/tools/closeServer.js");
    const { "default": getLogger, initLogger } = require("../lib/cjs/tools/getLogger.js");
    const { "default": getRequestPath } = require("../lib/cjs/tools/getRequestPath.js");
    const { "default": logRequest } = require("../lib/cjs/tools/logRequest.js");

// consts

    const REQUEST = {
        "method": "GET",
        "protocol": "http",
        "hostname": "127.0.0.1",
        "path": "",
        "ips": [ "1.2.3.4" ],
        "ip": "1.2.3.4",
        "query": {
            "q": "quest"
        },
        "params": {
            "sound": "ready.wav"
        },
        "body": {
            "note": "logged"
        },
        "cookies": {
            "sid": "abc"
        }
    };

// private

    async function _closeCurrentLogger () {

        try {
            await getLogger().close();
        }
        catch (err) {

            if (!/Logger is not initialized/u.test(err.message)) {
                throw err;
            }

        }

    }

    async function _readLogs (home) {

        const directory = join(home, "warcraft3sounds", "logs");
        const names = await readdir(directory);
        const logs = names.filter((name) => {

            return name.endsWith(".log");

        });

        const contents = await Promise.all(logs.map((name) => {

            return readFile(join(directory, name), "utf8");

        }));

        return contents.join("\n");

    }

    function _assertLogged (logged) {

        const message = logged.split(/\r?\n/u).filter((line) => {

            return "" !== line;

        }).map((line) => {

            return JSON.parse(line).message;

        }).join("\n");

        ok(message.includes("1.2.3.4 => [GET]http://127.0.0.1 query {\"q\":\"quest\"}"));
        ok(message.includes("params {\"sound\":\"ready.wav\"}"));
        ok(message.includes("body {\"note\":\"logged\"}"));
        ok(message.includes("cookies {\"sid\":\"abc\"}"));
        equal(message.includes("[GET]http://127.0.0.1/"), false);

    }

    async function _openProductionLogger (home) {

        await _closeCurrentLogger();

        throws(() => {

            return getLogger();

        }, /Logger is not initialized/u);

        os.homedir = () => {
            return home;
        };
        process.env.NODE_ENV = "production";

        return initLogger();

    }

    function _unfinishedLogger () {

        const original = winston.createLogger;

        winston.createLogger = (options) => {

            const created = original(options);

            Object.defineProperty(created, "writableFinished", {
                "configurable": true,
                "get": () => {
                    return false;
                }
            });

            const end = created.end.bind(created);

            created.end = () => {

                end();
                created.emit("finish");

            };

            return created;

        };

        return () => {

            winston.createLogger = original;

        };

    }

    function _finishedLogger () {

        const original = winston.createLogger;

        winston.createLogger = (options) => {

            const created = original(options);

            Object.defineProperty(created, "writableFinished", {
                "configurable": true,
                "get": () => {
                    return true;
                }
            });

            return created;

        };

        return () => {

            winston.createLogger = original;

        };

    }

    function _fireSlowTimers () {

        const original = globalThis.setTimeout;

        globalThis.setTimeout = (fn, delay, ...args) => {

            if (8000 === delay) {
                fn(...args);

                return original(() => {

                    // the real timer is cleared once close finishes

                }, 0);
            }

            return original(fn, delay, ...args);

        };

        return () => {

            globalThis.setTimeout = original;

        };

    }

    function _listen (server) {

        return new Promise((resolve) => {

            server.listen(0, "127.0.0.1", resolve);

        });

    }

// tests

describe("logger", () => {

    const originalHomedir = os.homedir;
    const originalEnv = process.env.NODE_ENV;
    let home = null;

    after(async () => {

        os.homedir = originalHomedir;

        if ("undefined" === typeof originalEnv) {
            delete process.env.NODE_ENV;
        }
        else {
            process.env.NODE_ENV = originalEnv;
        }

        await initLogger();

    });

    it("should log to a file and close twice", async () => {

        home = await mkdtemp(join(os.tmpdir(), "warcraft3sounds-home-"));

        const logger = await _openProductionLogger(home);

        equal(getRequestPath(REQUEST), "[GET]http://127.0.0.1");
        logRequest(REQUEST);
        await logger.close();
        _assertLogged(await _readLogs(home));
        await logger.close();
        await rm(home, {
            "recursive": true,
            "force": true
        });

    });

    it("should wait until the log stream finishes", async () => {

        os.homedir = originalHomedir;
        process.env.NODE_ENV = "development";

        const restore = _unfinishedLogger();

        try {

            await _closeCurrentLogger();
            await (await initLogger()).close();

        }
        finally {

            restore();

        }

    });

    it("should close a log stream that is already finished", async () => {

        process.env.NODE_ENV = "development";

        const restore = _finishedLogger();

        try {

            await _closeCurrentLogger();
            await (await initLogger()).close();

        }
        finally {

            restore();

        }

    });

});

describe("closeServer", () => {

    it("should resolve once the server is closed", async () => {

        const server = createServer();

        await _listen(server);
        await closeServer(server);

    });

    it("should reject when close reports an error", async () => {

        const server = {
            "close": (callback) => {

                callback(new Error("close failed"));

            },
            "closeAllConnections": () => {

                // cleared before the timeout when close fails immediately

            },
            "closeIdleConnections": () => {

                // this fake has no idle connection

            }
        };

        await rejects(() => {

            return closeServer(server);

        }, /close failed/u);

    });

    it("should force connections closed when the server stays open", async () => {

        let forced = false;
        let finish = null;
        const restore = _fireSlowTimers();
        const server = {
            "close": (callback) => {

                finish = callback;

            },
            "closeAllConnections": () => {

                forced = true;

            },
            "closeIdleConnections": () => {

                // this fake has no idle connection

            }
        };

        try {

            const pending = closeServer(server);

            equal(forced, true);
            finish();
            await pending;

        }
        finally {

            restore();

        }

    });

});
