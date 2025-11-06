"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathAPISwagger = pathAPISwagger;
exports.pathAPIIps = pathAPIIps;
exports.pathAPIAllRaces = pathAPIAllRaces;
exports.pathAPIOneRace = pathAPIOneRace;
exports.pathAPIOneCharacter = pathAPIOneCharacter;
// natives
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
// locals
const returncodes_1 = __importDefault(require("../../returncodes"));
const model_1 = __importDefault(require("../../model"));
// module
function pathAPISwagger(req, res, next) {
    (0, promises_1.readFile)((0, node_path_1.join)(__dirname, "..", "..", "..", "data", "descriptor.json"), "utf-8").then((content) => {
        res.status(returncodes_1.default.OK).json(JSON.parse(content));
    }).catch(next);
}
function pathAPIIps(req, res, next) {
    (0, model_1.default)().getIps().then((ips) => {
        res.status(returncodes_1.default.OK).json(ips);
    }).catch(next);
}
function pathAPIAllRaces(req, res, next) {
    (0, model_1.default)().getRaces().then((races) => {
        res.status(returncodes_1.default.OK).json(races);
    }).catch(next);
}
function pathAPIOneRace(req, res, next) {
    (0, model_1.default)().getRace(req.params.race).then((race) => {
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
}
function pathAPIOneCharacter(req, res, next) {
    let notworded = false;
    if ("object" === typeof req.query) {
        if ("boolean" === typeof req.query.notworded) {
            notworded = req.query.notworded;
        }
        else if ("string" === typeof req.query.notworded) {
            notworded = "true" === req.query.notworded || "1" === req.query.notworded;
        }
        else if ("number" === typeof req.query.notworded) {
            notworded = 1 === req.query.notworded;
        }
    }
    (0, model_1.default)().getCharacter(req.params.race, req.params.character, notworded).then((character) => {
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
}
