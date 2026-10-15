/* eslint-disable n/no-process-env */
// n/no-process-env : the entry point reads NODE_ENV and PORT

// deps

    // natives
    const { equal } = require("node:assert");
    const { spawn } = require("node:child_process");
    const { mkdir, mkdtemp, rm, stat, writeFile } = require("node:fs/promises");
    const os = require("node:os");
    const { join } = require("node:path");

    // locals
    const { "default": getModel, setModel } = require("../lib/cjs/db/model.js");
    const { "default": getConf } = require("../lib/cjs/conf.js");
    const { "default": getLogger, initLogger } = require("../lib/cjs/tools/getLogger.js");
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
    const originalExitCode = process.exitCode;
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

    async function _waitUntil (read, attempts = 100) {

        if (read() || 0 >= attempts) {
            return read();
        }

        await _wait(50);

        return _waitUntil(read, attempts - 1);

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
        process.exitCode = originalExitCode;
        _restoreListeners(listeners);
        os.homedir = originalHomedir;
        _restoreEnv();

    }

// tests

    function _hooks () {

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

    }

describe("application entry", () => {

    _hooks();

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

describe("application entry failures", () => {

    _hooks();

    it("should keep an existing sounds directory when NODE_ENV is empty", async () => {

        process.env.NODE_ENV = "";
        delete process.env.PORT;
        await mkdir(join(home, "warcraft3sounds", "sounds"), {
            "recursive": true
        });

        await _boot();

        equal(process.env.NODE_ENV, "development");
        equal(getConf().get("port"), 8000);
        process.emit("SIGINT");
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 0);

    });

    it("should exit 1 when the sounds path is a file", async () => {

        process.env.NODE_ENV = "development";
        await mkdir(join(home, "warcraft3sounds"));
        await writeFile(join(home, "warcraft3sounds", "sounds"), "x");

        await _boot();
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should exit 1 when the logger cannot start", async () => {

        const file = join(home, "not-a-directory");

        await writeFile(file, "x");
        await getLogger().close();
        os.homedir = () => {
            return file;
        };
        process.env.NODE_ENV = "production";

        await _boot();
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should exit 1 when shutdown cannot release the database", async () => {

        await _boot();
        const failure = new Error("release failed");

        failure.stack = null;
        getModel().release = () => {

            return Promise.reject(failure);

        };
        process.emit("SIGTERM");
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should exit 1 when a rejection is not an error", async () => {

        await _boot();
        process.listeners("unhandledRejection").forEach((listener) => {

            if (!listeners.unhandledRejection.includes(listener)) {
                return;
            }

            process.removeListener("unhandledRejection", listener);

        });
        process.emit("unhandledRejection", "nope");
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should exit 1 when a rejection is an error", async () => {

        const failure = new Error("rejected");

        await _boot();
        process.listeners("unhandledRejection").forEach((listener) => {

            if (!listeners.unhandledRejection.includes(listener)) {
                return;
            }

            process.removeListener("unhandledRejection", listener);

        });
        process.emit("unhandledRejection", failure);
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should exit 1 on a fatal error that has no stack", async () => {

        const fatal = new Error("no stack");

        fatal.stack = null;

        await _boot();
        process.listeners("uncaughtException").forEach((listener) => {

            if (!listeners.uncaughtException.includes(listener)) {
                return;
            }

            process.removeListener("uncaughtException", listener);

        });
        process.emit("uncaughtException", fatal);
        await _waitForExit(exits);

        equal(exits.length, 1);
        equal(exits[0], 1);

    });

    it("should force the process to exit when shutdown hangs", async () => {

        const trapped = globalThis.setTimeout;

        globalThis.setTimeout = (fn, delay, ...args) => {

            if (15000 === delay) {
                fn(...args);
            }

            return trapped(fn, delay, ...args);

        };

        await _boot();
        process.emit("SIGTERM");
        await _waitForExit(exits);
        await _waitUntil(() => {
            return 1 < exits.length;
        });

        equal(exits.includes(1), true);

    });

    it("should boot when this file is the program", async () => {

        const child = spawn(process.execPath, [
            "-r",
            join(__dirname, "helpers", "emit-sigterm.js"),
            join(__dirname, "..", "lib", "cjs", "main.cjs")
        ], {
            "env": {
                ...process.env,
                "HOME": home,
                "USERPROFILE": home,
                "PORT": "0",
                "NODE_ENV": "development"
            }
        });
        let output = "";

        child.stdout.on("data", (chunk) => {

            output += String(chunk);

        });
        child.stderr.on("data", (chunk) => {

            output += String(chunk);

        });

        const exited = new Promise((resolve) => {

            child.once("exit", resolve);

        });
        const started = await _waitUntil(() => {
            return output.includes("started on port");
        });

        const code = await exited;

        equal(started, true);
        equal(code, 0);

    });

});
