// deps

    // natives
    const { join } = require("node:path");
    const { rmSync } = require("node:fs");
    const { tmpdir } = require("node:os");
    const { randomUUID } = require("node:crypto");

    // locals
    const { WarcraftSoundsModel, setModel } = require("../../lib/cjs/db/model.js");
    const getConf = require("../../lib/cjs/conf.js").default;
    const { initLogger } = require("../../lib/cjs/tools/getLogger.js");
    const { setSoundsDirectory } = require("../../lib/cjs/tools/getSoundsDirectory.js");

// consts

    const SCHEMA_FILE = join(__dirname, "..", "..", "lib", "data", "create.sql");
    const SEED_FILE = join(__dirname, "..", "fixtures", "seed.minimal.sql");
    const SOUNDS_DIR = join(__dirname, "..", "fixtures", "sounds");

    const TEMP_FILES = [];

// module

    // each model gets its own SQLite file : no in-memory database
    function createTemporaryStorage () {

        const file = join(tmpdir(), "warcraft3sounds-" + randomUUID() + ".sqlite");

        TEMP_FILES.push(file);

        return file;

    }

    function createTestModel (storage) {

        getConf()
            .set("database-file", "undefined" !== typeof storage ? storage : createTemporaryStorage());

        return new WarcraftSoundsModel({
            "schemaFile": SCHEMA_FILE,
            "seedFiles": [ SEED_FILE ]
        });

    }

    // the model as production builds it : default schema file and default (Drizzle) seed
    function createCatalogModel () {

        getConf()
            .set("database-file", createTemporaryStorage());

        return new WarcraftSoundsModel();

    }

    function setupTestAppData () {

        const model = createTestModel();

        return initLogger().then(() => {

            return model.init();

        }).then(() => {

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

// "exit" listeners must be synchronous
// libsql only frees the file handle on garbage collection, so Windows can still lock a file here : the OS cleans the temporary directory then
process.on("exit", () => {

    TEMP_FILES.forEach((file) => {

        [
 "", "-journal", "-wal", "-shm"
].forEach((suffix) => {

            try {

                // eslint-disable-next-line n/no-sync
                rmSync(file + suffix, {
                    "force": true
                });

            }
            catch {
                // nothing to do here
            }

        });

    });

});

module.exports = {
    SCHEMA_FILE,
    SEED_FILE,
    SOUNDS_DIR,
    createTestModel,
    createCatalogModel,
    setupTestAppData,
    teardownTestAppData
};
