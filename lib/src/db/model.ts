// deps

    // natives
    import { join, resolve } from "node:path";
    import { readFile } from "node:fs/promises";
    import { pathToFileURL } from "node:url";

    // externals
    import { and, asc, eq, ne, sql } from "drizzle-orm";
    import { drizzle } from "drizzle-orm/libsql";

    // locals
    import getConf from "../conf";
    import checkDatabaseFile from "./checkDatabaseFile";
    import * as schema from "./schema";
    import seed from "./seed";

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
        // null : the catalog is seeded with Drizzle inserts
        private readonly _seedFiles: string[] | null;

    // constructor

    public constructor (options: iWarcraftSoundsModelOptions = {}) {

        this._schemaFile = "undefined" !== typeof options.schemaFile ? options.schemaFile : _dataFile("create.sql");
        this._seedFiles = "undefined" !== typeof options.seedFiles ? options.seedFiles : null;

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

    private _seed (): Promise<void> {

        return null === this._seedFiles ? seed(this._getDb()) : this._execSeedFiles(this._seedFiles);

    }

    private _execSeedFiles (files: string[]): Promise<void> {

        return files.reduce((previous: Promise<void>, file: string): Promise<void> => {

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
            await this._seed();
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

        const [ character ] = await this._getDb()
            .select({
                "id": schema.characters.id,
                "code": schema.characters.code,
                "name": schema.characters.name,
                "icon": schema.characters.icon,
                "hero": schema.characters.hero,
                "tft": schema.characters.tft
            })
            .from(schema.characters)
            .innerJoin(schema.races, eq(schema.races.id, schema.characters.k_race))
            .where(and(
                eq(schema.races.code, codeRace),
                eq(schema.characters.code, code)
            ))
            .limit(1);

        if ("undefined" === typeof character) {
            return null;
        }

        const actions: Array<{
            "code": string;
            "name": string;
            "file": string;
            "typeCode": string;
            "typeName": string;
        }> = await this._getDb()
            .select({
                "code": schema.actions.code,
                "name": schema.actions.name,
                "file": schema.actions.file,
                "typeCode": schema.actionsTypes.code,
                "typeName": schema.actionsTypes.name
            })
            .from(schema.actions)
            .innerJoin(schema.actionsTypes, eq(schema.actionsTypes.id, schema.actions.k_action_type))
            .where(and(
                eq(schema.actions.k_character, character.id),
                notWorded ? sql `1 = 1` : ne(schema.actions.name, "")
            ));

        return {
            "code": character.code,
            "name": character.name,
            "url": "/api/races/" + codeRace + "/characters/" + code,
            "icon": character.icon,
            "hero": character.hero,
            "tft": character.tft,
            "actions": actions.map((action): components["schemas"]["Action"] => {

                return {
                    "code": action.code,
                    "name": action.name,
                    "file": action.file,
                    "url": "/public/sounds/" + action.file,
                    "type": {
                        "code": action.typeCode,
                        "name": action.typeName
                    }
                };

            })
        };

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
