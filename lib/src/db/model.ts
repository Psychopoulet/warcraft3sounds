// deps

    // natives
    import { join, resolve } from "node:path";
    import { readFile } from "node:fs/promises";
    import { pathToFileURL } from "node:url";

    // externals
    import { sql } from "drizzle-orm";
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

        const racesData: iSQLRequestResult[] = await this._getDb().all<iSQLRequestResult>(sql `
            SELECT
                races.id AS race_id, races.code AS race_code, races.name AS race_name, races.icon AS race_icon,
                characters.code AS character_code, characters.name AS character_name, characters.icon AS character_icon, characters.hero AS character_hero, characters.tft AS character_tft,
                musics.code AS music_code, musics.name AS music_name, musics.file AS music_file,
                warnings.code AS warning_code, warnings.name AS warning_name, warnings.file AS warning_file
            FROM races
                LEFT JOIN characters ON characters.k_race = races.id
                LEFT JOIN musics ON musics.k_race = races.id
                LEFT JOIN warnings ON warnings.k_race = races.id
            WHERE races.code = ${code}
            ORDER BY races.name, characters.name, musics.name, warnings.name
        `);

        if (0 >= racesData.length) {
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
