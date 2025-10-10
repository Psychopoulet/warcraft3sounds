"use strict";
// deps
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarcraftSoundsModel = void 0;
exports.default = getModel;
// natives
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
// externals
const sqlite3_1 = require("sqlite3");
// consts
const SQLLite3 = (0, sqlite3_1.verbose)();
// module
class WarcraftSoundsModel {
    // constructor
    constructor() {
        this._db = new SQLLite3.Database(":memory:");
    }
    // methods
    init() {
        // open db
        return new Promise((resolve) => {
            this._db.serialize(resolve);
            // read file
        }).then(() => {
            return (0, promises_1.readFile)((0, node_path_1.join)(__dirname, "..", "..", "data", "create.sql"), "utf-8").then((content) => {
                return (0, promises_1.readFile)((0, node_path_1.join)(__dirname, "..", "..", "data", "toword.sql"), "utf-8").then((contenttoWord) => {
                    return content + contenttoWord;
                });
            }).then((content) => {
                return new Promise((resolve) => {
                    process.nextTick(() => {
                        const result = [];
                        content.split(";").forEach((request) => {
                            const data = request
                                .trim()
                                .replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
                                .replace(/\t/g, "")
                                .split("\n")
                                .filter((line) => {
                                return "" !== line.trim() && "--" !== line.substring(0, 2);
                            })
                                .join(" ")
                                .trim();
                            if ("" !== data) {
                                result.push(data + ";");
                            }
                        });
                        resolve(result);
                    });
                });
            });
            // execute requests
        }).then((queries) => {
            const _execQuery = (i) => {
                return i < queries.length ? new Promise((resolve, reject) => {
                    this._db.run(queries[i], (err) => {
                        return err ? reject(err) : resolve();
                    });
                }).then(() => {
                    return _execQuery(i + 1);
                }) : Promise.resolve();
            };
            return _execQuery(0);
        });
    }
    release() {
        return new Promise((resolve, reject) => {
            this._db.close((err) => {
                return err ? reject(err) : resolve();
            });
        });
    }
    getIps() {
        const result = [];
        const ifaces = (0, node_os_1.networkInterfaces)();
        Object.keys(ifaces).forEach((ifname) => {
            let alias = 0;
            ifaces[ifname].forEach((iface) => {
                if ("IPv4" === iface.family && false === iface.internal) {
                    result.push({
                        "address": iface.address,
                        "name": 1 <= alias ? ifname + "-" + alias : ifname
                    });
                    ++alias;
                }
            });
        });
        return Promise.resolve(result);
    }
    getRaces() {
        return new Promise((resolve, reject) => {
            this._db.all("SELECT code, name, icon FROM races ORDER BY name;", (err, data) => {
                return err
                    ? reject(err)
                    : resolve(data.map((race) => {
                        return Object.assign(Object.assign({}, race), { "url": "/api/races/" + race.code, "icon": race.icon });
                    }));
            });
        });
    }
    getRace(code) {
        return new Promise((resolve, reject) => {
            this._db.all(" SELECT"
                + " races.id AS race_id, races.code AS race_code, races.name AS race_name, races.icon AS race_icon,"
                + " characters.code AS character_code, characters.name AS character_name, characters.icon AS character_icon, characters.hero AS character_hero, characters.tft AS character_tft,"
                + " musics.code AS music_code, musics.name AS music_name, musics.file AS music_file,"
                + " warnings.code AS warning_code, warnings.name AS warning_name, warnings.file AS warning_file"
                + " FROM races"
                + " LEFT JOIN characters ON characters.k_race = races.id"
                + " LEFT JOIN musics ON musics.k_race = races.id"
                + " LEFT JOIN warnings ON warnings.k_race = races.id"
                + " WHERE races.code = ?"
                + " ORDER BY races.name, characters.name, musics.name, warnings.name;", [code], (err, data) => {
                return err ? reject(err) : resolve(data);
            });
        }).then((racesData) => {
            return !racesData || !racesData.length ? Promise.resolve(null) : new Promise((resolve) => {
                process.nextTick(() => {
                    const result = {
                        "code": code,
                        "name": racesData[0].race_name,
                        "url": "/api/races/" + code,
                        "icon": racesData[0].race_icon,
                        "characters": [],
                        "musics": [],
                        "warnings": []
                    };
                    racesData.forEach((data) => {
                        if (data.character_code) {
                            if (-1 === result.characters.findIndex((character) => {
                                return character.code === data.character_code;
                            })) {
                                result.characters.push({
                                    "code": data.character_code,
                                    "name": data.character_name,
                                    "url": "/api/races/" + code + "/characters/" + data.character_code,
                                    "icon": data.character_icon,
                                    "hero": 1 === data.character_hero,
                                    "tft": 1 === data.character_tft
                                });
                            }
                        }
                        if (data.music_code) {
                            if (-1 === result.musics.findIndex((music) => {
                                return music.code === data.music_code;
                            })) {
                                result.musics.push({
                                    "code": data.music_code,
                                    "name": data.music_name,
                                    "file": data.music_file,
                                    "url": "/public/sounds/" + data.music_file
                                });
                            }
                        }
                        if (data.warning_code) {
                            if (-1 === result.warnings.findIndex((warning) => {
                                return warning.code === data.warning_code;
                            })) {
                                result.warnings.push({
                                    "code": data.warning_code,
                                    "name": data.warning_name,
                                    "file": data.warning_file,
                                    "url": "/public/sounds/" + data.warning_file
                                });
                            }
                        }
                    });
                    return resolve(result);
                });
            });
        });
    }
    getCharacter(codeRace, code, notWorded = false) {
        return new Promise((resolve, reject) => {
            this._db.get(" SELECT characters.id, characters.code, characters.name, characters.icon, characters.hero, characters.tft"
                + " FROM characters"
                + " INNER JOIN races ON races.id = characters.k_race"
                + " WHERE"
                + " races.code = ?"
                + " AND characters.code = ?"
                + " ORDER BY characters.name;", [codeRace, code], (err, data) => {
                return err ? reject(err) : resolve(data);
            });
        }).then((characterData) => {
            return !characterData ? Promise.resolve(null) : Promise.resolve().then(() => {
                return new Promise((resolve, reject) => {
                    this._db.all(" SELECT "
                        + " actions.code, actions.name, actions.file,"
                        + " actions_types.code AS type_code, actions_types.name AS type_name"
                        + " FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type"
                        + " WHERE actions.k_character = ?"
                        + (notWorded ? "" : " AND \"\" != actions.name")
                        + ";", [characterData.id], (err, data) => {
                        return err ? reject(err) : resolve(data);
                    });
                }).then((data) => {
                    return new Promise((resolve) => {
                        process.nextTick(() => {
                            const result = {
                                "code": characterData.code,
                                "name": characterData.name,
                                "url": "/api/races/" + codeRace + "/characters/" + code,
                                "icon": characterData.icon,
                                "hero": 1 === characterData.hero,
                                "tft": 1 === characterData.tft,
                                "actions": []
                            };
                            data.forEach((action) => {
                                result.actions.push({
                                    "code": action.code,
                                    "name": action.name,
                                    "file": action.file,
                                    "url": "/public/sounds/" + action.file,
                                    "type": {
                                        "code": action.type_code,
                                        "name": action.type_name
                                    }
                                });
                            });
                            resolve(result);
                        });
                    });
                });
            });
        });
    }
}
exports.WarcraftSoundsModel = WarcraftSoundsModel;
let _model = null;
function getModel() {
    if (!_model) {
        _model = new WarcraftSoundsModel();
    }
    return _model;
}
