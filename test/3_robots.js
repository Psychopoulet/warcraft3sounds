// deps

    // natives
    const { equal } = require("node:assert");

    // locals
    const { startHttpTest, stopHttpTest, request } = require("./helpers/http.js");

// tests

describe("GET /robots.txt", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should disallow all bots", async () => {

        const res = await request(ctx.baseUrl, "/robots.txt");

        equal(res.status, 200);
        equal(res.headers["content-type"].startsWith("text/plain"), true);
        equal(res.body.toString("utf8"), "User-agent: *\nDisallow: /\n");

    });

});
