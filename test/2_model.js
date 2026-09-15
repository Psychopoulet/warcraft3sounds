// deps

    // natives
    const { equal, deepEqual, rejects } = require("node:assert");
    const { join } = require("node:path");
    const { mkdtemp, rm } = require("node:fs/promises");
    const { tmpdir } = require("node:os");

    // locals
    const { createTestModel } = require("./helpers/model.js");

// consts

    const HUMAN_ICON = "https://classic.battle.net/war3/images/human/humanseal.gif";
    const PEASANT_ICON = "https://classic.battle.net/war3/images/human/units/portraits/peasant.gif";

    const EXPECTED_RACE_LIST = [
        {
            "code": "humans",
            "name": "Humains",
            "icon": HUMAN_ICON,
            "url": "/api/races/humans"
        }
    ];

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

    const EXPECTED_CHARACTER = {
        "code": "peasant",
        "name": "Paysan",
        "url": "/api/races/humans/characters/peasant",
        "icon": PEASANT_ICON,
        "hero": false,
        "tft": false,
        "actions": [
            {
                "code": "ready1",
                "name": "Prêt !",
                "file": "ready.wav",
                "url": "/public/sounds/ready.wav",
                "type": {
                    "code": "ready",
                    "name": "Prêt !"
                }
            }
        ]
    };

// tests

describe("model", () => {

    describe("init / release", () => {

        it("should init with the minimal seed", async () => {

            const model = createTestModel();

            await model.init();

            deepEqual(await model.getRaces(), EXPECTED_RACE_LIST);

            await model.release();

        });

        it("should not re-seed on a second init", async () => {

            const model = createTestModel();

            await model.init();
            await model.init();

            equal((await model.getRaces()).length, 1);

            await model.release();

        });

        it("should reject queries after release", async () => {

            const model = createTestModel();

            await model.init();
            await model.release();

            await rejects(() => {
                return model.getRaces();
            });

        });

        it("should persist data in a file across release", async () => {

            const dir = await mkdtemp(join(tmpdir(), "warcraft3sounds-"));
            const storage = join(dir, "test.sqlite");

            const first = createTestModel(storage);
            await first.init();
            equal((await first.getRaces()).length, 1);
            await first.release();

            const second = createTestModel(storage);
            await second.init();
            deepEqual(await second.getRaces(), EXPECTED_RACE_LIST);
            await second.release();

            await rm(dir, {
                "recursive": true,
                "force": true
            });

        });

    });

    describe("getRaces / getRace / getCharacter", () => {

        let model = null;

        before(async () => {

            model = createTestModel();
            await model.init();

        });

        after(async () => {

            if (model) {
                await model.release();
            }

        });

        it("should list races", async () => {

            deepEqual(await model.getRaces(), EXPECTED_RACE_LIST);

        });

        it("should get one race", async () => {

            deepEqual(await model.getRace("humans"), EXPECTED_RACE);

        });

        it("should return null for an unknown race", async () => {

            equal(await model.getRace("orcs"), null);

        });

        it("should get one character", async () => {

            deepEqual(await model.getCharacter("humans", "peasant"), EXPECTED_CHARACTER);

        });

        it("should return null for an unknown character", async () => {

            equal(await model.getCharacter("humans", "paladin"), null);

        });

        it("should return null for a character on an unknown race", async () => {

            equal(await model.getCharacter("orcs", "peasant"), null);

        });

    });

});
