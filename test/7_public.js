// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const { readFile } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const { startHttpTest, stopHttpTest, request } = require("./helpers/http.js");

// consts

    const PUBLIC = join(__dirname, "..", "public");

    const REDIRECTS = [
        [ "/", "/public/index.html" ],
        [ "/index.html", "/public/index.html" ],
        [ "/public/bundle.js", "/public/bundle.min.js" ],
        [ "/public/bundle.js.map", "/public/bundle.min.js.map" ],
        [ "/favicon.ico", "/public/pictures/warcraft3.png" ],
        [ "/favicon.png", "/public/pictures/warcraft3.png" ]
    ];

    const FILES = [
        [
 "/public/index.html", join(PUBLIC, "index.html"), "text/html"
],
        [
 "/public/bundle.min.js", join(PUBLIC, "dist", "bundle.min.js"), "text/javascript"
],
        [
 "/public/bundle.min.js.map", join(PUBLIC, "dist", "bundle.min.js.map"), "application/json"
],
        [
 "/public/pictures/warcraft3.png", join(PUBLIC, "pictures", "warcraft3.png"), "image/png"
],
        [
 "/public/pictures/warcraft3TFT.png", join(PUBLIC, "pictures", "warcraft3TFT.png"), "image/png"
]
    ];

// tests

describe("public files and redirects", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should redirect aliases", async () => {

        const results = await Promise.all(REDIRECTS.map((entry) => {

            return request(ctx.baseUrl, entry[0]);

        }));

        results.forEach((res, index) => {

            const [ from, to ] = REDIRECTS[index];

            equal(res.status, 301, from);
            equal(res.headers.location, to, from);
            equal(res.body.toString("utf8"), "Redirected to \"" + to + "\"", from);

        });

    });

    it("should return the built files", async () => {

        const results = await Promise.all(FILES.map(async (entry) => {

            return {
                "res": await request(ctx.baseUrl, entry[0]),
                "expected": await readFile(entry[1]),
                "type": entry[2],
                "path": entry[0]
            };

        }));

        results.forEach((item) => {

            equal(item.res.status, 200, item.path);
            equal(item.res.headers["content-type"].startsWith(item.type), true, item.path);
            deepEqual(item.res.body, item.expected, item.path);

        });

    });

});
