// deps

    // natives
    const { join } = require("node:path");

    // locals
    const { WarcraftSoundsModel, setModel } = require("../../lib/cjs/model.js");
    const getConf = require("../../lib/cjs/conf.js").default;
    const { setSoundsDirectory } = require("../../lib/cjs/tools/getSoundsDirectory.js");

// consts

    const SCHEMA_FILE = join(__dirname, "..", "..", "lib", "data", "create.sql");
    const SEED_FILE = join(__dirname, "..", "fixtures", "seed.minimal.sql");
    const SOUNDS_DIR = join(__dirname, "..", "fixtures", "sounds");

// module

    function createTestModel (storage) {

        getConf()
            .set("database-file", "undefined" !== typeof storage ? storage : ":memory:");

        return new WarcraftSoundsModel({
            "schemaFile": SCHEMA_FILE,
            "seedFiles": [ SEED_FILE ]
        });

    }

    function setupTestAppData () {

        const model = createTestModel();

        return model.init().then(() => {

            setModel(model);
            setSoundsDirectory(SOUNDS_DIR);

            return model;

        });

    }

    function teardownTestAppData (model) {

        return model.release().then(() => {

            setModel(null);
            setSoundsDirectory(null);

        });

    }

module.exports = {
    SCHEMA_FILE,
    SEED_FILE,
    SOUNDS_DIR,
    createTestModel,
    setupTestAppData,
    teardownTestAppData
};
