// deps

    // native
    const { join } = require("node:path");
    const { get } = require("node:http");
    const { doesNotThrow, strictEqual } = require("node:assert");

    // externals
    const generateServer = require(join(__dirname, "..", "lib", "server", "generateServer.js"));
    const webRoutes = require(join(__dirname, "..", "lib", "server", "webRoutes.js"));
    const apiRoutes = require(join(__dirname, "..", "lib", "api", "routes.js"));

// consts

    const PORT = "3000";
    const MAIN_URL = "http://127.0.0.1:" + PORT + "/";

// module

describe("API / routes", () => {

    const API_URL = MAIN_URL + "api/";

    let server = null;

    beforeEach(() => {

        return generateServer().then((APP) => {

            return webRoutes(APP).then(() => {
                return Promise.resolve(APP);
            });

        }).then((APP) => {

            return apiRoutes(APP).then(() => {
                return Promise.resolve(APP);
            });

        }).then((APP) => {

            return new Promise((resolve) => {

                server = APP.listen(PORT, () => {
                    resolve(APP);
                });

            });

        });

    });

    afterEach(() => {

        return new Promise((resolve) => {

            server.close(() => {
                server = null;
                resolve();
            });

        });

    });

    it("should get the IPs recovery (" + API_URL + "ips)", () => {

        return new Promise((resolve) => {

            get(API_URL + "ips", (res) => {

                strictEqual(res.statusCode, 200, "The statusCode is not 200");
                strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
                strictEqual(typeof res.headers, "object", "The headers are not an object");
                strictEqual(
                    res.headers["content-type"].toLowerCase(),
                    "application/json; charset=utf-8",
                    "The content-type header are not json/utf8"
                );

                res.setEncoding("utf8");

                let rawData = "";

                res.on("data", (chunk) => {
                    rawData += chunk;
                }).on("end", () => {

                    strictEqual(typeof rawData, "string", "The the returned content is not a string");

                    doesNotThrow(() => {
                        JSON.parse(rawData);
                    }, "The the returned content is not a JSON");

                    resolve();

                });

            });

        });

    });

    it("should test error (" + API_URL + "err)", () => {

        return new Promise((resolve) => {

            get(API_URL + "err", (res) => {

                strictEqual(res.statusCode, 500, "The statusCode is not 500");
                strictEqual(res.statusMessage, "Internal Server Error", "The statusMessage is not valid");
                strictEqual(typeof res.headers, "object", "The headers are not an object");
                strictEqual(
                    res.headers["content-type"].toLowerCase(),
                    "application/json; charset=utf-8",
                    "The content-type header are not json/utf8"
                );

                res.setEncoding("utf8");

                let rawData = "";

                res.on("data", (chunk) => {
                    rawData += chunk;
                }).on("end", () => {

                    strictEqual(typeof rawData, "string", "The the returned content is not a string");

                    doesNotThrow(() => {
                        JSON.parse(rawData);
                    }, "The the returned content is not a JSON");

                    resolve();

                });

            });

        });

    });

    describe("races", () => {

        it("should get the races (" + API_URL + "races)", () => {

            return new Promise((resolve) => {

                get(API_URL + "races", (res) => {

                    strictEqual(res.statusCode, 200, "The statusCode is not 200");
                    strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
                    strictEqual(typeof res.headers, "object", "The headers are not an object");
                    strictEqual(
                        res.headers["content-type"].toLowerCase(),
                        "application/json; charset=utf-8",
                        "The content-type header are not json/utf8"
                    );

                    res.setEncoding("utf8");

                    let rawData = "";

                    res.on("data", (chunk) => {
                        rawData += chunk;
                    }).on("end", () => {

                        strictEqual(typeof rawData, "string", "The returned content is not a string");

                        doesNotThrow(() => {
                            JSON.parse(rawData);
                        }, "The returned content is not a JSON");

                        const data = JSON.parse(rawData);

                        strictEqual(data.length, 5, "The returned data does not have the right length");
                        strictEqual(data[0].code, "nightelfs", "The first returned data does not have the right value");
                        strictEqual(data[0].name, "Elfes de la nuit", "The first returned data does not have the right value");
                        strictEqual(data[0].url, "/api/races/nightelfs", "The first returned data does not have the right value");

                        resolve();

                    });

                });

            });

        });

        it("should get an unknown race (" + API_URL + "races/test)", () => {

            return new Promise((resolve) => {

                get(API_URL + "races/test", (res) => {

                    strictEqual(res.statusCode, 404, "The statusCode is not 404");
                    strictEqual(res.statusMessage, "Not Found", "The statusMessage is not valid");
                    strictEqual(typeof res.headers, "object", "The headers are not an object");
                    strictEqual(
                        res.headers["content-type"].toLowerCase(),
                        "application/json; charset=utf-8",
                        "The content-type header are not json/utf8"
                    );

                    res.setEncoding("utf8");

                    let rawData = "";

                    res.on("data", (chunk) => {
                        rawData += chunk;
                    }).on("end", () => {

                        strictEqual(typeof rawData, "string", "The returned content is not a string");

                        doesNotThrow(() => {
                            JSON.parse(rawData);
                        }, "The returned content is not a JSON");

                        const data = JSON.parse(rawData);

                        strictEqual(typeof data, "object", "The returned data are not an object");
                        strictEqual(typeof data.code, "number", "The returned code are not an object");
                        strictEqual(data.code, 404, "The returned code are not as expected");
                        strictEqual(typeof data.message, "string", "The returned message are not an object");
                        strictEqual(data.message, "Impossible to find \"test\"", "The returned message are not as expected");

                        resolve();

                    });

                });

            });

        });

        it("should get a valid race (" + API_URL + "races/nightelfs)", () => {

            return new Promise((resolve) => {

                get(API_URL + "races/nightelfs", (res) => {

                    strictEqual(res.statusCode, 200, "The statusCode is not 200");
                    strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
                    strictEqual(typeof res.headers, "object", "The headers are not an object");
                    strictEqual(
                        res.headers["content-type"].toLowerCase(),
                        "application/json; charset=utf-8",
                        "The content-type header are not json/utf8"
                    );

                    res.setEncoding("utf8");

                    let rawData = "";

                    res.on("data", (chunk) => {
                        rawData += chunk;
                    }).on("end", () => {

                        strictEqual(typeof rawData, "string", "The returned content is not a string");

                        doesNotThrow(() => {
                            JSON.parse(rawData);
                        }, "The returned content is not a JSON");

                        const data = JSON.parse(rawData);

                        strictEqual(typeof data, "object", "The returned data are not an object");
                        strictEqual(data.code, "nightelfs", "The returned data does not have the right code");
                        strictEqual(data.name, "Elfes de la nuit", "The returned data does not have the right name");

                        strictEqual(typeof data.characters, "object", "The returned data does not have valid characters");
                        strictEqual(data.characters instanceof Array, true, "The returned data does not have valid characters");

                            strictEqual(0 < data.characters.length, true, "The returned data does not have characters");
                            strictEqual(data.characters[0].code, "archer", "The first character does not have valid code");
                            strictEqual(data.characters[0].name, "Archer", "The first character does not have valid name");
                            strictEqual(
                                data.characters[0].url,
                                "/api/races/nightelfs/characters/archer",
                                "The first character does not have valid url"
                            );

                        strictEqual(typeof data.musics, "object", "The returned data does not have valid musics");
                        strictEqual(data.musics instanceof Array, true, "The returned data does not have valid musics");

                            strictEqual(0 < data.musics.length, true, "The returned data does not have musics");
                            strictEqual(data.musics[0].code, "defeat", "The first music does not have valid code");
                            strictEqual(data.musics[0].name, "Défaite", "The first music does not have valid name");
                            strictEqual(
                                data.musics[0].url,
                                "/public/sounds/NightElfDefeat.mp3",
                                "The first music does not have valid url"
                            );

                        strictEqual(typeof data.warnings, "object", "The returned data does not have valid warnings");
                        strictEqual(data.warnings instanceof Array, true, "The returned data does not have valid warnings");

                            strictEqual(0 < data.warnings.length, true, "The returned data does not have warnings");
                            strictEqual(data.warnings[0].code, "upgradecomplete", "The first warning does not have valid code");
                            strictEqual(data.warnings[0].name, "Amélioration terminée", "The first warning does not have valid name");
                            strictEqual(
                                data.warnings[0].url,
                                "/public/sounds/SentinelUpgradeComplete1.wav",
                                "The first warning does not have valid url"
                            );

                        resolve();

                    });

                });

            });

        });

        describe("characters", () => {

            it("should get an unknown character (" + API_URL + "races/humans/characters/test)", () => {

                return new Promise((resolve) => {

                    get(API_URL + "races/humans/characters/test", (res) => {

                        strictEqual(res.statusCode, 404, "The statusCode is not 404");
                        strictEqual(res.statusMessage, "Not Found", "The statusMessage is not valid");
                        strictEqual(typeof res.headers, "object", "The headers are not an object");
                        strictEqual(
                            res.headers["content-type"].toLowerCase(),
                            "application/json; charset=utf-8",
                            "The content-type header are not json/utf8"
                        );

                        res.setEncoding("utf8");

                        let rawData = "";

                        res.on("data", (chunk) => {
                            rawData += chunk;
                        }).on("end", () => {

                            strictEqual(typeof rawData, "string", "The returned content is not a string");

                            doesNotThrow(() => {
                                JSON.parse(rawData);
                            }, "The returned content is not a JSON");

                            const data = JSON.parse(rawData);

                            strictEqual(typeof data, "object", "The returned data are not an object");
                            strictEqual(typeof data.code, "number", "The returned code are not an object");
                            strictEqual(data.code, 404, "The returned code are not as expected");
                            strictEqual(typeof data.message, "string", "The returned message are not an object");
                            strictEqual(
                                data.message,
                                "Impossible to find \"test\" for race \"humans\"",
                                "The returned message are not as expected"
                            );

                            resolve();

                        });

                    });

                });

            });

            it("should get a valid character (" + API_URL + "races/humans/characters/knight)", () => {

                return new Promise((resolve) => {

                    get(API_URL + "races/humans/characters/knight", (res) => {

                        strictEqual(res.statusCode, 200, "The statusCode is not 200");
                        strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
                        strictEqual(typeof res.headers, "object", "The headers are not an object");
                        strictEqual(
                            res.headers["content-type"].toLowerCase(),
                            "application/json; charset=utf-8",
                            "The content-type header are not json/utf8"
                        );

                        res.setEncoding("utf8");

                        let rawData = "";

                        res.on("data", (chunk) => {
                            rawData += chunk;
                        }).on("end", () => {

                            strictEqual(typeof rawData, "string", "The returned content is not a string");

                            doesNotThrow(() => {
                                JSON.parse(rawData);
                            }, "The returned content is not a JSON");

                            const data = JSON.parse(rawData);

                            strictEqual(typeof data, "object", "The returned data are not an object");
                            strictEqual(data.code, "knight", "The returned data does not have the right code");
                            strictEqual(data.name, "Chevalier", "The returned data does not have the right name");

                            strictEqual(typeof data.actions, "object", "The returned data does not have valid actions");
                            strictEqual(data.actions instanceof Array, true, "The returned data does not have valid actions");

                                strictEqual(0 < data.actions.length, true, "The returned data does not have actions");
                                strictEqual(data.actions[0].code, "ready1", "The first action does not have valid code");
                                strictEqual(data.actions[0].name, "J'attend vos ordres", "The first action does not have valid name");
                                strictEqual(data.actions[0].file, "KnightReady1.wav", "The first action does not have valid file");
                                strictEqual(
                                    data.actions[0].url,
                                    "/public/sounds/KnightReady1.wav",
                                    "The first action does not have valid url"
                                );

                                strictEqual(typeof data.actions[0].type, "object", "The first action does not have valid type");

                                    strictEqual(data.actions[0].type.code, "ready", "The first action type does not have valid code");
                                    strictEqual(data.actions[0].type.name, "Prêt !", "The first action type does not have valid name");

                            resolve();

                        });

                    });

                });

            });

        });

    });

});
