"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiRoutes;
// natives
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
// locals
const returncodes_1 = __importDefault(require("../returncodes"));
const model_1 = __importDefault(require("./model"));
// module
function apiRoutes(app) {
    const model = new model_1.default();
    // swagger
    return model.init().then(() => {
        app.get("/api/descriptor", (req, res, next) => {
            (0, promises_1.readFile)((0, node_path_1.join)(__dirname, "..", "..", "data", "descriptor.json"), "utf-8").then((content) => {
                res.status(returncodes_1.default.OK).json(JSON.parse(content));
            }).catch(next);
        });
        // server ips
    }).then(() => {
        app.get("/api/ips", (req, res, next) => {
            model.getIps().then((ips) => {
                res.status(returncodes_1.default.OK).json(ips);
            }).catch(next);
        });
        // all races
    }).then(() => {
        app.get("/api/races", (req, res, next) => {
            model.getRaces().then((races) => {
                res.status(returncodes_1.default.OK).json(races);
            }).catch(next);
        });
        // one race
    }).then(() => {
        app.get("/api/races/:race", (req, res, next) => {
            model.getRace(req.params.race).then((race) => {
                if (race) {
                    res.status(returncodes_1.default.OK).json(race);
                }
                else {
                    res.status(returncodes_1.default.NOTFOUND).json({
                        "code": returncodes_1.default.NOTFOUND,
                        "message": "Impossible to find \"" + req.params.race + "\" race"
                    });
                }
            }).catch(next);
        });
        // characters
    }).then(() => {
        app.get("/api/races/:race/characters/:character", (req, res, next) => {
            model.getCharacter(req.params.race, req.params.character, req.query && "undefined" !== typeof req.query.notworded ? Boolean(req.query.notworded) : false).then((character) => {
                if (character) {
                    res.status(returncodes_1.default.OK).json(character);
                }
                else {
                    res.status(returncodes_1.default.NOTFOUND).json({
                        "code": returncodes_1.default.NOTFOUND,
                        "message": "Impossible to find \"" + req.params.character + "\" character for race \"" + req.params.race + "\""
                    });
                }
            }).catch(next);
        });
        // test error
    }).then(() => {
        app.get("/api/err", (req, res, next) => {
            next(new Error("This is a test error"));
        });
    });
}
;
