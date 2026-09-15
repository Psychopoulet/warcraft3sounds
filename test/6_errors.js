// deps

    // natives
    const { equal, deepEqual } = require("node:assert");

    // locals
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// tests

describe("errors", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should return 500 on /api/err", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/err");

        equal(res.status, 500);
        deepEqual(res.json, {
            "code": 500,
            "message": "This is a test error"
        });

    });

});
