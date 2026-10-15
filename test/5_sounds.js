// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const { readFile } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const { startHttpTest, stopHttpTest, request, requestJson } = require("./helpers/http.js");

// consts

    const READY_WAV = join(__dirname, "fixtures", "sounds", "ready.wav");
    const THEME_MP3 = join(__dirname, "fixtures", "sounds", "theme.mp3");

// tests

describe("sounds", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should return the fixture wav", async () => {

        const res = await request(ctx.baseUrl, "/public/sounds/ready.wav");
        const expected = await readFile(READY_WAV);

        equal(res.status, 200);
        equal(res.headers["content-type"], "audio/wav");
        deepEqual(res.body, expected);

    });

    it("should return the fixture mp3", async () => {

        const res = await request(ctx.baseUrl, "/public/sounds/theme.mp3");
        const expected = await readFile(THEME_MP3);

        equal(res.status, 200);
        equal(res.headers["content-type"], "audio/mpeg");
        deepEqual(res.body, expected);

    });

    it("should return 404 for a directory", async () => {

        const res = await requestJson(ctx.baseUrl, "/public/sounds/nested.wav");

        equal(res.status, 404);
        deepEqual(res.json, {
            "code": "404",
            "message": "Impossible to find the \"nested.wav\" sound"
        });

    });

    it("should return 404 for a missing sound", async () => {

        const res = await requestJson(ctx.baseUrl, "/public/sounds/missing.wav");

        equal(res.status, 404);
        deepEqual(res.json, {
            "code": "404",
            "message": "Impossible to find the \"missing.wav\" sound"
        });

    });

});
