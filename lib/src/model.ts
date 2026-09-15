/* eslint-disable func-style */
// func-style : disallow arrow functions to keep "this" context

// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import { verbose } from "sqlite3";

    // locals
    import getConf from "./conf";

// types & interfaces

    // externals
    import type { sqlite3, Database } from "sqlite3";

    // locals
    import type { components } from "./Descriptor";

    export interface iWarcraftSoundsModelOptions {
        "schemaFile"?: string;
        "seedFiles"?: string[];
    }

// consts

    const SQLLite3: sqlite3 = verbose();

    function _dataFile (name: string): string {

        return join(__dirname, "..", "data", name);

    }

// module

export class WarcraftSoundsModel {

    // attributes

        // private

        private readonly _db: Database;
        private readonly _schemaFile: string;
        private readonly _seedFiles: string[];

    // constructor

    public constructor (options: iWarcraftSoundsModelOptions = {}) {

        this._db = new SQLLite3.Database(getConf().get<string>("database-file"));
        this._schemaFile = "undefined" !== typeof options.schemaFile ? options.schemaFile : _dataFile("create.sql");
        this._seedFiles = "undefined" !== typeof options.seedFiles
            ? options.seedFiles
            : [
                _dataFile("insert.sql"),
                _dataFile("toword.sql")
            ];

    }

    // methods

    private _sqlToQueries (content: string): string[] {

        const result: string[] = [];

        content.split(";").forEach((request: string): void => {

            const data: string = request
                        .trim()
                        .replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
                        .replace(/\t/g, "")
                        .split("\n")
                        .filter((line: string): boolean => {
                            return "" !== line.trim() && "--" !== line.substring(0, 2);
                        })
                        .join(" ")
                        .trim();

            if ("" !== data) {
                result.push(data + ";");
            }

        });

        return result;

    }

    private _execQueries (queries: string[]): Promise<void> {

        const _execQuery = (i: number): Promise<void> => {

            return i < queries.length ? new Promise((resolve: (value?: unknown) => void, reject: (err: Error) => void): void => {

                this._db.run(queries[i], (err: Error | null): void => {
                    return err ? reject(err) : resolve();
                });

            }).then((): Promise<void> => {
                return _execQuery(i + 1);
            }) : Promise.resolve();

        };

        return _execQuery(0);

    }

    private _execSqlFile (file: string): Promise<void> {

        return readFile(file, "utf-8").then((content: string): Promise<void> => {

            return this._execQueries(this._sqlToQueries(content));

        });

    }

    private _execSeedFiles (): Promise<void> {

        const _exec = (i: number): Promise<void> => {

            return i < this._seedFiles.length
                ? this._execSqlFile(this._seedFiles[i]).then((): Promise<void> => {
                    return _exec(i + 1);
                })
                : Promise.resolve();

        };

        return _exec(0);

    }

    private _tableExists (name: string): Promise<boolean> {

        return new Promise((resolve: (exists: boolean) => void, reject: (err: Error) => void): void => {

            this._db.get(
                "SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?;",
                [ name ],
                (err: Error | null, row: { "found": number } | undefined): void => {

                    return err ? reject(err) : resolve(Boolean(row));

                }
            );

        });

    }

    private _hasData (): Promise<boolean> {

        return new Promise((resolve: (hasData: boolean) => void, reject: (err: Error) => void): void => {

            this._db.get(
                "SELECT COUNT(*) AS n FROM races;",
                (err: Error | null, row: { "n": number } | undefined): void => {

                    return err ? reject(err) : resolve(Boolean(row && 0 < row.n));

                }
            );

        });

    }

    public init (): Promise<void> {

        return new Promise((resolve: (value?: unknown) => void): void => {

            this._db.serialize(resolve);

        }).then((): Promise<boolean> => {

            return this._tableExists("races");

        }).then((exists: boolean): Promise<void> => {

            return exists ? Promise.resolve() : this._execSqlFile(this._schemaFile);

        }).then((): Promise<boolean> => {

            return this._hasData();

        }).then((hasData: boolean): Promise<void> => {

            return hasData ? Promise.resolve() : this._execSeedFiles();

        });

    }

    public release (): Promise<void> {

        return new Promise((resolve: () => void, reject: (err: Error) => void): void => {

            this._db.close((err: Error | null): void => {
                return err ? reject(err) : resolve();
            });

        });

    }

    public getRaces (): Promise<Array<components["schemas"]["BasicRace"]>> {

        return new Promise((resolve: (data: Array<components["schemas"]["BasicRace"]>) => void, reject: (err: Error) => void): void => {

            this._db.all("SELECT code, name, icon FROM races ORDER BY id;", (err: Error | null, data: Array<components["schemas"]["BasicRace"]>): void => {

                return err
                    ? reject(err)
                    : resolve(data.map((race): components["schemas"]["BasicRace"] => {

                        return {
                            ...race,
                            "url": "/api/races/" + race.code,
                            "icon": race.icon
                        };

                    }));

            });

        });

    }

    public getRace (code: string): Promise<components["schemas"]["Race"] | null> {

        interface iSQLRequestResult {
            "race_id": number;
            "race_code": string;
            "race_name": string;
            "race_icon": string;
            "character_code": string;
            "character_name": string;
            "character_icon": string;
            "character_hero": number;
            "character_tft": number;
            "music_code": string;
            "music_name": string;
            "music_file": string;
            "warning_code": string;
            "warning_name": string;
            "warning_file": string;
        }

        return new Promise((resolve: (data: iSQLRequestResult[]) => void, reject: (err: Error) => void) => {

            this._db.all(
                " SELECT"
                    + " races.id AS race_id, races.code AS race_code, races.name AS race_name, races.icon AS race_icon,"
                    + " characters.code AS character_code, characters.name AS character_name, characters.icon AS character_icon, characters.hero AS character_hero, characters.tft AS character_tft,"
                    + " musics.code AS music_code, musics.name AS music_name, musics.file AS music_file,"
                    + " warnings.code AS warning_code, warnings.name AS warning_name, warnings.file AS warning_file"
                + " FROM races"
                    + " LEFT JOIN characters ON characters.k_race = races.id"
                    + " LEFT JOIN musics ON musics.k_race = races.id"
                    + " LEFT JOIN warnings ON warnings.k_race = races.id"
                + " WHERE races.code = ?"
                + " ORDER BY races.name, characters.name, musics.name, warnings.name;",
            [ code ], (err: Error | null, data: iSQLRequestResult[]): void => {
                return err ? reject(err) : resolve(data);
            });

        }).then((racesData: iSQLRequestResult[] | undefined): components["schemas"]["Race"] | null => {

            if ("undefined" === typeof racesData || 0 >= racesData.length) {
                return null;
            }

            const result: components["schemas"]["Race"] = {
                "code": code,
                "name": racesData[0].race_name,
                "url": "/api/races/" + code,
                "icon": racesData[0].race_icon,
                "characters": [],
                "musics": [],
                "warnings": []
            };

            racesData.forEach((data: iSQLRequestResult): void => {

                if (data.character_code) {

                    if (-1 === result.characters.findIndex((character: components["schemas"]["BasicCharacter"]): boolean => {
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

                    if (-1 === result.musics.findIndex((music: components["schemas"]["BasicData"]): boolean => {
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

                    if (-1 === result.warnings.findIndex((warning: components["schemas"]["BasicData"]): boolean => {
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

            return result;

        });

    }

    public getCharacter (codeRace: string, code: string, notWorded: boolean = false): Promise<components["schemas"]["Character"] | null> {

        interface iSQLRequestResult {
            "id": number;
            "code": string;
            "name": string;
            "icon": string;
            "hero": number;
            "tft": number;
        }

        return new Promise((resolve: (data: iSQLRequestResult) => void, reject: (err: Error) => void) => {

            this._db.get(
                " SELECT characters.id, characters.code, characters.name, characters.icon, characters.hero, characters.tft"
                + " FROM characters"
                    + " INNER JOIN races ON races.id = characters.k_race"
                + " WHERE"
                    + " races.code = ?"
                    + " AND characters.code = ?"
                + " ORDER BY characters.name;",
            [ codeRace, code ], (err: Error | null, data: iSQLRequestResult): void => {
                return err ? reject(err) : resolve(data);
            });

        }).then((characterData: iSQLRequestResult | undefined): Promise<components["schemas"]["Character"] | null> => {

            if (!characterData) {
                return Promise.resolve(null);
            }

            interface iSQLActionRequestResult {
                "code": string;
                "name": string;
                "file": string;
                "type_code": string;
                "type_name": string;
            }

            return new Promise((resolve: (data: iSQLActionRequestResult[]) => void, reject: (err: Error) => void): void => {

                this._db.all(
                    " SELECT "
                        + " actions.code, actions.name, actions.file,"
                        + " actions_types.code AS type_code, actions_types.name AS type_name"
                    + " FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type"
                    + " WHERE actions.k_character = ?"
                        + (notWorded ? "" : " AND \"\" != actions.name")
                    + ";",
                [ characterData.id ], (err: Error | null, data: iSQLActionRequestResult[]): void => {
                    return err ? reject(err) : resolve(data);
                });

            }).then((data: iSQLActionRequestResult[]): components["schemas"]["Character"] => {

                const result: components["schemas"]["Character"] = {
                    "code": characterData.code,
                    "name": characterData.name,
                    "url": "/api/races/" + codeRace + "/characters/" + code,
                    "icon": characterData.icon,
                    "hero": 1 === characterData.hero,
                    "tft": 1 === characterData.tft,
                    "actions": []
                };

                data.forEach((action: iSQLActionRequestResult): void => {

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

                return result;

            });

        });

    }

}

let _model: WarcraftSoundsModel | null = null;

export function setModel (model: WarcraftSoundsModel | null): void {

    _model = model;

}

export default function getModel (): WarcraftSoundsModel {

    _model ??= new WarcraftSoundsModel();

    return _model;

}
