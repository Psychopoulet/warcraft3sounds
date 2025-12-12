// deps

    const { join } = require("node:path");
    const { stat } = require("node:fs/promises");
    const assert = require("node:assert");

    const Model = require(join(__dirname, "..", "lib", "api", "model.js"));

// consts

    const SOUNDS_DIRECTORY = join(__dirname, "..", "lib", "public", "sounds");

// module

describe("Sounds", () => {

    let model = null;

    before("should init the model", () => {
        model = new Model();
        return model.init();
    });

    after("should release the model", () => {
        return model.release();
    });

    it("should check sounds existance", () => {

        // if no sound extracted, does not run the test
        return stat(join(SOUNDS_DIRECTORY, "Human1.mp3")).then((stats) => {
            return Promise.resolve(stats.isFile());
        }).then((exists) => {

            return !exists
                ? Promise.resolve()
                : model.getRaces().then((races) => {

                    assert.strictEqual("object", typeof races, "The returned races is not an object");
                    assert.strictEqual(true, races instanceof Array, "The returned races is not an Array");
                    assert.strictEqual(5, races.length, "The returned races has an invalid length");

                    const sounds = [];
                    const characters = [];

                    return Promise.all(races.map((r) => {

                        return model.getRace(r.code).then((race) => {

                            race.characters.forEach((character) => {

                                characters.push({
                                    "race": race.code,
                                    "character": character.code
                                });

                            });

                            race.musics.forEach((music) => {
                                sounds.push(join(SOUNDS_DIRECTORY, music.file));
                            });

                            race.warnings.forEach((music) => {
                                sounds.push(join(SOUNDS_DIRECTORY, music.file));
                            });

                        });

                    })).then(() => {

                        return Promise.all(characters.map((c) => {

                            return model.getCharacter(c.race, c.character).then((character) => {

                                character.actions.forEach((action) => {
                                    sounds.push(join(SOUNDS_DIRECTORY, action.file));
                                });

                            });

                        }));

                    }).then(() => {

                        return Promise.all(sounds.map((s) => {

                            return stat(s).then((stats) => {

                                return stats.isFile()
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("\"" + s + "\" does not exist"));

                            });

                        }));

                    });

                });

        });

    });

});
