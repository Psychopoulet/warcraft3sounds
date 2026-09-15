// deps

    // natives
    const { equal, deepEqual } = require("node:assert");

    // locals
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// tests

describe("GET /health", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should return ok", async () => {

        const res = await requestJson(ctx.baseUrl, "/health");

        equal(res.status, 200);
        deepEqual(res.json, {
            "status": "ok"
        });

    });

});
