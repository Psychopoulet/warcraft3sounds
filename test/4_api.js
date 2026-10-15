// deps

    // natives
    const { equal, deepEqual } = require("node:assert");
    const { readFile } = require("node:fs/promises");
    const { join } = require("node:path");

    // locals
    const { startHttpTest, stopHttpTest, requestJson } = require("./helpers/http.js");
    const { createCatalogModel } = require("./helpers/model.js");
    const { setModel } = require("../lib/src/db/model.ts");
    const { pathAPIOneCharacter } = require("../lib/src/server/paths/api.ts");

// consts

    const PACKAGE_FILE = join(__dirname, "..", "package.json");
    const SEED_FILE = join(__dirname, "..", "lib", "data", "seed.json");
    const NOTWORDED_FILE = join(__dirname, "..", "lib", "data", "seed-notworded.json");

    const HUMAN_ICON = "https://classic.battle.net/war3/images/human/humanseal.gif";
    const PEASANT_ICON = "https://classic.battle.net/war3/images/human/units/portraits/peasant.gif";

    const EXPECTED_RACE = {
        "code": "humans",
        "name": "Humains",
        "url": "/api/races/humans",
        "icon": HUMAN_ICON,
        "characters": [
            {
                "code": "peasant",
                "name": "Paysan",
                "url": "/api/races/humans/characters/peasant",
                "icon": PEASANT_ICON,
                "hero": false,
                "tft": false
            }
        ],
        "musics": [
            {
                "code": "theme1",
                "name": "Thème 1",
                "file": "theme.mp3",
                "url": "/public/sounds/theme.mp3"
            }
        ],
        "warnings": [
            {
                "code": "townattack",
                "name": "Notre ville est assiégée",
                "file": "warning.wav",
                "url": "/public/sounds/warning.wav"
            }
        ]
    };

// private

    function _unnamedCodes (character) {

        return character.actions.filter((action) => {

            return "" === action.name;

        }).map((action) => {

            return action.code;

        }).sort();

    }

    async function _sylvanasUnnamedCodes () {

        const seed = JSON.parse(await readFile(SEED_FILE, "utf8"));
        const notworded = JSON.parse(await readFile(NOTWORDED_FILE, "utf8"));
        const character = seed.characters.find((item) => {

            return "sylvanas" === item.code;

        });

        return notworded.actions.filter((action) => {

            return action.k_character === character.id;

        }).map((action) => {

            return action.code;

        }).sort();

    }

    function _requestCharacter (notworded) {

        return new Promise((resolve, reject) => {

            const res = {
                "status": (code) => {

                    res.statusCode = code;

                    return res;

                },
                "json": (body) => {

                    resolve({
                        "status": res.statusCode,
                        "json": body
                    });

                }
            };

            pathAPIOneCharacter({
                "path": "/api/races/nightelfs/characters/sylvanas",
                "params": {
                    "racecode": "nightelfs",
                    "charactercode": "sylvanas"
                },
                "query": {
                    "notworded": notworded
                }
            }, res, reject);

        });

    }

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

    it("should return one race", async () => {

        const res = await requestJson(ctx.baseUrl, "/api/races/humans");

        equal(res.status, 200);
        deepEqual(res.json, EXPECTED_RACE);

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

describe("notworded", () => {

    let model = null;
    let unnamed = null;

    before(async () => {

        model = createCatalogModel();
        await model.init();
        setModel(model);
        unnamed = await _sylvanasUnnamedCodes();

    });

    after(async () => {

        if (model) {
            await model.release();
        }

        setModel(null);

    });

    it("should omit unnamed actions unless notworded is true", async () => {

        const named = await model.getCharacter("nightelfs", "sylvanas");
        const all = await model.getCharacter("nightelfs", "sylvanas", true);

        deepEqual(_unnamedCodes(named), []);
        deepEqual(_unnamedCodes(all), unnamed);

    });

    it("should accept string and number notworded values", async () => {

        const included = await Promise.all([
            true,
            "true",
            "1",
            1
        ].map((notworded) => {

            return _requestCharacter(notworded);

        }));

        const omitted = await Promise.all([
            false,
            "false",
            "0",
            0
        ].map((notworded) => {

            return _requestCharacter(notworded);

        }));

        included.forEach((res) => {

            equal(res.status, 200);
            deepEqual(_unnamedCodes(res.json), unnamed);

        });

        omitted.forEach((res) => {

            equal(res.status, 200);
            deepEqual(_unnamedCodes(res.json), []);

        });

    });

});
