// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import SqliteDatabase from "better-sqlite3";
    import { sql } from "drizzle-orm";
    import { drizzle } from "drizzle-orm/better-sqlite3";

    // locals
    import getConf from "./conf";

// types & interfaces

    // externals
    import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

    // locals
    import type { components } from "./Descriptor";

    export interface iWarcraftSoundsModelOptions {
        "schemaFile"?: string;
        "seedFiles"?: string[];
    }

// consts

    function _dataFile (name: string): string {

        return join(__dirname, "..", "data", name);

    }

// module

export class WarcraftSoundsModel {

    // attributes

        // private

        private readonly _sqlite: SqliteDatabase.Database;
        private readonly _db: BetterSQLite3Database;
        private readonly _schemaFile: string;
        private readonly _seedFiles: string[];

    // constructor

    public constructor (options: iWarcraftSoundsModelOptions = {}) {

        this._sqlite = new SqliteDatabase(getConf().get<string>("database-file"));
        this._db = drizzle(this._sqlite);
        this._schemaFile = "undefined" !== typeof options.schemaFile ? options.schemaFile : _dataFile("create.sql");
        this._seedFiles = "undefined" !== typeof options.seedFiles
            ? options.seedFiles
            : [
                _dataFile("insert.sql"),
                _dataFile("toword.sql")
            ];

    }

    // methods

    private _execSqlFile (file: string): Promise<void> {

        return readFile(file, "utf-8").then((content: string): void => {

            this._sqlite.exec(content);

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

            try {

                const row: { "found": number } | undefined = this._db.get<{ "found": number }>(
                    sql `SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ${name}`
                );

                resolve(Boolean(row));

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

        });

    }

    private _hasData (): Promise<boolean> {

        return new Promise((resolve: (hasData: boolean) => void, reject: (err: Error) => void): void => {

            try {

                const row: { "n": number } | undefined = this._db.get<{ "n": number }>(
                    sql `SELECT COUNT(*) AS n FROM races;`
                );

                resolve(0 < row.n);

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

        });

    }

    public init (): Promise<void> {

        return this._tableExists("races").then((exists: boolean): Promise<void> => {

            return exists ? Promise.resolve() : this._execSqlFile(this._schemaFile);

        }).then((): Promise<boolean> => {

            return this._hasData();

        }).then((hasData: boolean): Promise<void> => {

            return hasData ? Promise.resolve() : this._execSeedFiles();

        });

    }

    public release (): Promise<void> {

        return new Promise((resolve: () => void, reject: (err: Error) => void): void => {

            try {

                this._sqlite.close();
                resolve();

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

        });

    }

    public getRaces (): Promise<Array<components["schemas"]["BasicRace"]>> {

        return new Promise((resolve: (data: Array<components["schemas"]["BasicRace"]>) => void, reject: (err: Error) => void): void => {

            try {

                const data: Array<components["schemas"]["BasicRace"]> = this._sqlite.prepare<[], components["schemas"]["BasicRace"]>(
                    "SELECT code, name, icon FROM races ORDER BY id;"
                ).all();

                resolve(data.map((race): components["schemas"]["BasicRace"] => {

                    return {
                        ...race,
                        "url": "/api/races/" + race.code,
                        "icon": race.icon
                    };

                }));

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

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

            try {

                resolve(this._sqlite.prepare<[ string ], iSQLRequestResult>(
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
                    + " ORDER BY races.name, characters.name, musics.name, warnings.name;"
                ).all(code));

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

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

        return new Promise((resolve: (data: iSQLRequestResult | undefined) => void, reject: (err: Error) => void) => {

            try {

                resolve(this._sqlite.prepare<[ string, string ], iSQLRequestResult>(
                    " SELECT characters.id, characters.code, characters.name, characters.icon, characters.hero, characters.tft"
                    + " FROM characters"
                        + " INNER JOIN races ON races.id = characters.k_race"
                    + " WHERE"
                        + " races.code = ?"
                        + " AND characters.code = ?"
                    + " ORDER BY characters.name;"
                ).get(codeRace, code));

            }
            catch (err: unknown) {

                reject(err instanceof Error ? err : new Error(String(err)));

            }

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

                try {

                    resolve(this._sqlite.prepare<[ number ], iSQLActionRequestResult>(
                        " SELECT "
                            + " actions.code, actions.name, actions.file,"
                            + " actions_types.code AS type_code, actions_types.name AS type_name"
                        + " FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type"
                        + " WHERE actions.k_character = ?"
                            + (notWorded ? "" : " AND '' != actions.name")
                        + ";"
                    ).all(characterData.id));

                }
                catch (err: unknown) {

                    reject(err instanceof Error ? err : new Error(String(err)));

                }

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
