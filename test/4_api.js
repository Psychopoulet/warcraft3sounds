// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const { readFile } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");

// consts

    const PACKAGE_FILE = join(__dirname, "..", "package.json");

// tests

describe("API OpenAPI", () => {

    let ctx = null;

    before(async () => {

        ctx = await startHttpTest();

    });

    after(async () => {

        if (ctx) {
            await stopHttpTest(ctx);
        }

    });

    it("should return the descriptor", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/descriptor");
        const packageFile = JSON.parse(await readFile(PACKAGE_FILE, "utf-8"));

        equal(res.status, 200);
        equal(res.json.info.title, packageFile.name);
        equal(res.json.info.version, packageFile.version);

    });

    it("should list races", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races");

        equal(res.status, 200);
        deepEqual(res.json, [
            {
                "code": "humans",
                "name": "Humains",
                "icon": "https://classic.battle.net/war3/images/human/humanseal.gif",
                "url": "/api/races/humans"
            }
        ]);

    });

    it("should return 404 for an unknown race", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races/orcs");

        equal(res.status, 404);
        deepEqual(res.json, {
            "code": "404",
            "message": "Impossible to find \"orcs\" race"
        });

    });

    it("should return one character", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races/humans/characters/peasant");

        equal(res.status, 200);
        equal(res.json.code, "peasant");

    });

    it("should return 404 for an unknown character", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races/humans/characters/paladin");

        equal(res.status, 404);
        deepEqual(res.json, {
            "code": "404",
            "message": "Impossible to find \"paladin\" character for race \"humans\""
        });

    });

});
