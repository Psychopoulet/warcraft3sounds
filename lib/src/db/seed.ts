// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // locals
    import * as schema from "./schema";

// types & interfaces

    // externals
    import type { BatchItem } from "drizzle-orm/batch";
    import type { LibSQLDatabase } from "drizzle-orm/libsql";

    interface iSeedData {
        "races": Array<typeof schema.races.$inferInsert>;
        "actions_types": Array<typeof schema.actionsTypes.$inferInsert>;
        "musics": Array<typeof schema.musics.$inferInsert>;
        "warnings": Array<typeof schema.warnings.$inferInsert>;
        "characters": Array<typeof schema.characters.$inferInsert>;
        "actions": Array<typeof schema.actions.$inferInsert>;
    }

    interface iSeedNotWordedData {
        "actions": Array<typeof schema.actions.$inferInsert>;
    }

// private

    async function _readSeedFile<T> (name: string): Promise<T> {

        return JSON.parse(await readFile(join(__dirname, "..", "..", "data", name), "utf-8")) as T;

    }

    // stay far under SQLite's bound-variable limit
    const _CHUNK_SIZE: number = 100;

    function _chunks<T> (rows: T[]): T[][] {

        const chunks: T[][] = [];

        for (let i: number = 0; i < rows.length; i += _CHUNK_SIZE) {
            chunks.push(rows.slice(i, i + _CHUNK_SIZE));
        }

        return chunks;

    }

    // ids are explicit for races, actions_types and characters : later rows reference them
    function _buildQueries (db: LibSQLDatabase<typeof schema>, data: iSeedData): [ BatchItem<"sqlite">, ...Array<BatchItem<"sqlite">> ] {

        const queries: Array<BatchItem<"sqlite">> = [
            ..._chunks(data.races).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.races).values(rows);
            }),
            ..._chunks(data.actions_types).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.actionsTypes).values(rows);
            }),
            ..._chunks(data.musics).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.musics).values(rows);
            }),
            ..._chunks(data.warnings).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.warnings).values(rows);
            }),
            ..._chunks(data.characters).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.characters).values(rows);
            }),
            ..._chunks(data.actions).map((rows): BatchItem<"sqlite"> => {
                return db.insert(schema.actions).values(rows);
            })
        ];

        return queries as [ BatchItem<"sqlite">, ...Array<BatchItem<"sqlite">> ];

    }

// module

// insert the whole catalog in one atomic batch, parents before children :
// - lib/data/seed.json : every table, the actions having a name
// - lib/data/seed-notworded.json : the actions without a name (still to be worded)
export default async function seed (db: LibSQLDatabase<typeof schema>): Promise<void> {

    const [ data, notWorded ] = await Promise.all([
        _readSeedFile<iSeedData>("seed.json"),
        _readSeedFile<iSeedNotWordedData>("seed-notworded.json")
    ]);

    await db.batch(_buildQueries(db, {
        ...data,
        "actions": [ ...data.actions, ...notWorded.actions ]
    }));

}
