/* eslint-disable n/no-process-env */
// n/no-process-env : the entry point reads NODE_ENV and PORT

// deps

    // natives
    const { equal } = require("node:assert");
    const { mkdtemp, rm, stat } = require("node:fs/promises");
    const os = require("node:os");
    const { join } = require("node:path");

    // locals
    const { setModel } = require("../lib/cjs/db/model.js");
    const { "default": getConf } = require("../lib/cjs/conf.js");
    const { initLogger } = require("../lib/cjs/tools/getLogger.js");
    const { setSoundsDirectory } = require("../lib/cjs/tools/getSoundsDirectory.js");
    const { "default": startApplication } = require("../lib/cjs/main.cjs");

// consts

    const SIGNALS = [
 "SIGINT", "SIGTERM", "uncaughtException", "unhandledRejection"
];

    const originalHomedir = os.homedir;
    const originalEnv = process.env.NODE_ENV;
    const originalPort = process.env.PORT;
    const originalExit = process.exit;
    let home = null;
    let listeners = null;
    let timers = null;
    let originalSetTimeout = null;
    const exits = [];

// private

    function _wait (ms) {

        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    }

    function _listeners () {

        const snapshot = {};

        SIGNALS.forEach((name) => {

            snapshot[name] = process.listeners(name).slice();

        });

        return snapshot;

    }

    function _restoreListeners (snapshot) {

        SIGNALS.forEach((name) => {

            process.listeners(name).forEach((listener) => {

                if (!snapshot[name].includes(listener)) {
                    process.removeListener(name, listener);
                }

            });

            snapshot[name].forEach((listener) => {

                if (!process.listeners(name).includes(listener)) {
                    process.on(name, listener);
                }

            });

        });

    }

    function _trapLongTimers (bucket) {

        const original = globalThis.setTimeout;

        globalThis.setTimeout = (fn, delay, ...args) => {

            const timer = original(fn, delay, ...args);

            if ("number" === typeof delay && 8000 <= delay) {
                bucket.push(timer);
            }

            return timer;

        };

        return original;

    }

    async function _waitForExit (codes, attempts = 250) {

        if (0 < codes.length || 0 >= attempts) {
            return codes[0];
        }

        await _wait(20);

        return _waitForExit(exits, attempts - 1);

    }

    async function _boot () {

        setSoundsDirectory(null);
        setModel(null);

        await startApplication();

    }

    function _restoreEnv () {

        if ("undefined" === typeof originalEnv) {
            delete process.env.NODE_ENV;
        }
        else {
            process.env.NODE_ENV = originalEnv;
        }

        if ("undefined" === typeof originalPort) {
            delete process.env.PORT;
        }
        else {
            process.env.PORT = originalPort;
        }

    }

    function _restoreProcess () {

        timers.forEach((timer) => {

            clearTimeout(timer);

        });
        globalThis.setTimeout = originalSetTimeout;
        process.exit = originalExit;
        _restoreListeners(listeners);
        os.homedir = originalHomedir;
        _restoreEnv();

    }

// tests

describe("application entry", () => {

    beforeEach(async () => {

        exits.length = 0;
        timers = [];
        listeners = _listeners();
        home = await mkdtemp(join(os.tmpdir(), "warcraft3sounds-home-"));
        os.homedir = () => {
            return home;
        };
        originalSetTimeout = _trapLongTimers(timers);
        process.exit = (code) => {

            exits.push(code);

        };

    });

    afterEach(async () => {

        _restoreProcess();

        await rm(home, {
            "recursive": true,
            "force": true
        }).catch(() => {

            return Promise.resolve();

        });
        await initLogger();

    });

    it("should create the sounds directory and listen on port 8000", async () => {

        delete process.env.PORT;

        await _boot();

        equal(getConf().get("port"), 8000);
        equal((await stat(join(home, "warcraft3sounds", "sounds"))).isDirectory(), true);

        process.emit("SIGTERM");
        process.emit("SIGTERM");
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 0);

    });

    it("should keep a configured port and exit 1 on a fatal error", async () => {

        process.env.PORT = "0";

        await _boot();

        equal(getConf().get("port"), 0);

        process.listeners("uncaughtException").forEach((listener) => {

            if (!listeners.uncaughtException.includes(listener)) {
                return;
            }

            process.removeListener("uncaughtException", listener);

        });
        process.emit("uncaughtException", new Error("boom"));
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

});
