// deps

    // natives
    import { join, resolve } from "node:path";
    import { readFile } from "node:fs/promises";
    import { pathToFileURL } from "node:url";

    // externals
    import { asc, eq, sql } from "drizzle-orm";
    import { drizzle } from "drizzle-orm/libsql";

    // locals
    import getConf from "../conf";
    import checkDatabaseFile from "./checkDatabaseFile";
    import * as schema from "./schema";

// types & interfaces

    // externals
    import type { Client } from "@libsql/client";
    import type { LibSQLDatabase } from "drizzle-orm/libsql";

    // locals
    import type { components } from "../Descriptor";

    // "$client" is the libsql client created by drizzle
    type tDatabase = LibSQLDatabase<typeof schema> & {
        "$client": Client;
    };

    export interface iWarcraftSoundsModelOptions {
        "schemaFile"?: string;
        "seedFiles"?: string[];
    }

// consts

    function _dataFile (name: string): string {

        return join(__dirname, "..", "..", "data", name);

    }

// module

export class WarcraftSoundsModel {

    // attributes

        // private

        private _db: tDatabase | null = null;
        private readonly _schemaFile: string;
        private readonly _seedFiles: string[];

    // constructor

    public constructor (options: iWarcraftSoundsModelOptions = {}) {

        this._schemaFile = "undefined" !== typeof options.schemaFile ? options.schemaFile : _dataFile("create.sql");
        this._seedFiles = "undefined" !== typeof options.seedFiles
            ? options.seedFiles
            : [
                _dataFile("insert.sql"),
                _dataFile("toword.sql")
            ];

    }

    // methods

    private _getDb (): tDatabase {

        if (null === this._db) {
            throw new Error("The database is not opened : call init() first, and do not use it after release()");
        }

        return this._db;

    }

    private async _open (): Promise<void> {

        // already opened
        if (null !== this._db) {
            return Promise.resolve();
        }

        return checkDatabaseFile(getConf().get<string>("database-file")).then((file: string): void => {

            this._db = drizzle(pathToFileURL(resolve(file)).href, {
                "schema": schema
            });

        });

    }

    private async _execSqlFile (file: string): Promise<void> {

        return this._getDb().$client.executeMultiple(await readFile(file, "utf-8"));

    }

    private _execSeedFiles (): Promise<void> {

        return this._seedFiles.reduce((previous: Promise<void>, file: string): Promise<void> => {

            return previous.then((): Promise<void> => {
                return this._execSqlFile(file);
            });

        }, Promise.resolve());

    }

    private async _tableExists (name: string): Promise<boolean> {

        const rows: Array<{ "found": number }> = await this._getDb().all<{ "found": number }>(
            sql `SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ${name}`
        );

        return 0 < rows.length;

    }

    private async _hasData (): Promise<boolean> {

        const rows: Array<{ "n": number }> = await this._getDb().all<{ "n": number }>(
            sql `SELECT COUNT(*) AS n FROM races`
        );

        return 0 < rows[0].n;

    }

    public async init (): Promise<void> {

        await this._open();

        if (!await this._tableExists("races")) {
            await this._execSqlFile(this._schemaFile);
        }

        if (!await this._hasData()) {
            await this._execSeedFiles();
        }

    }

    public release (): Promise<void> {

        this._db?.$client.close();
        this._db = null;

        return Promise.resolve();

    }

    public async getRaces (): Promise<Array<components["schemas"]["BasicRace"]>> {

        const data: Array<Pick<typeof schema.races.$inferSelect, "code" | "name" | "icon">> = await this._getDb()
            .select({
                "code": schema.races.code,
                "name": schema.races.name,
                "icon": schema.races.icon
            })
            .from(schema.races)
            .orderBy(schema.races.id);

        return data.map((race): components["schemas"]["BasicRace"] => {

            return {
                ...race,
                "url": "/api/races/" + race.code,
                "icon": race.icon
            };

        });

    }

    public async getRace (code: string): Promise<components["schemas"]["Race"] | null> {

        const race = await this._getDb().query.races.findFirst({
            "where": eq(schema.races.code, code),
            "with": {
                "characters": {
                    "orderBy": asc(schema.characters.name)
                },
                "musics": {
                    "orderBy": asc(schema.musics.name)
                },
                "warnings": {
                    "orderBy": asc(schema.warnings.name)
                }
            }
        });

        if ("undefined" === typeof race) {
            return null;
        }

        return {
            "code": race.code,
            "name": race.name,
            "url": "/api/races/" + race.code,
            "icon": race.icon,
            "characters": race.characters.map((character): components["schemas"]["BasicCharacter"] => {

                return {
                    "code": character.code,
                    "name": character.name,
                    "url": "/api/races/" + race.code + "/characters/" + character.code,
                    "icon": character.icon,
                    "hero": character.hero,
                    "tft": character.tft
                };

            }),
            "musics": race.musics.map((music): components["schemas"]["BasicFileData"] => {

                return {
                    "code": music.code,
                    "name": music.name,
                    "file": music.file,
                    "url": "/public/sounds/" + music.file
                };

            }),
            "warnings": race.warnings.map((warning): components["schemas"]["BasicFileData"] => {

                return {
                    "code": warning.code,
                    "name": warning.name,
                    "file": warning.file,
                    "url": "/public/sounds/" + warning.file
                };

            })
        };

    }

    public async getCharacter (codeRace: string, code: string, notWorded: boolean = false): Promise<components["schemas"]["Character"] | null> {

        interface iSQLRequestResult {
            "id": number;
            "code": string;
            "name": string;
            "icon": string;
            "hero": number;
            "tft": number;
        }

        interface iSQLActionRequestResult {
            "code": string;
            "name": string;
            "file": string;
            "type_code": string;
            "type_name": string;
        }

        const characters: iSQLRequestResult[] = await this._getDb().all<iSQLRequestResult>(sql `
            SELECT characters.id, characters.code, characters.name, characters.icon, characters.hero, characters.tft
            FROM characters
                INNER JOIN races ON races.id = characters.k_race
            WHERE
                races.code = ${codeRace}
                AND characters.code = ${code}
            ORDER BY characters.name
        `);

        if (0 >= characters.length) {
            return null;
        }

        const [ characterData ] = characters;

        const actions: iSQLActionRequestResult[] = await this._getDb().all<iSQLActionRequestResult>(sql `
            SELECT
                actions.code, actions.name, actions.file,
                actions_types.code AS type_code, actions_types.name AS type_name
            FROM actions INNER JOIN actions_types ON actions_types.id = actions.k_action_type
            WHERE actions.k_character = ${characterData.id}
                ${notWorded ? sql `` : sql `AND '' != actions.name`}
        `);

        const result: components["schemas"]["Character"] = {
            "code": characterData.code,
            "name": characterData.name,
            "url": "/api/races/" + codeRace + "/characters/" + code,
            "icon": characterData.icon,
            "hero": 1 === characterData.hero,
            "tft": 1 === characterData.tft,
            "actions": []
        };

        actions.forEach((action: iSQLActionRequestResult): void => {

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
