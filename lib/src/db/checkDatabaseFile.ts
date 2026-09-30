// deps

    // natives
    import { stat } from "node:fs/promises";

// types & interfaces

    // natives
    import type { Stats } from "node:fs";

// module

// the database must be a real SQLite file : no in-memory database, no URL
export default function checkDatabaseFile (file: string): Promise<string> {

    const name: string = file.trim();

    if ("" === name || ":memory:" === name.toLowerCase() || name.toLowerCase().startsWith("file:")) {
        return Promise.reject(new Error("Invalid \"database-file\" : it must be the path of a SQLite file (\"" + file + "\" given)"));
    }

    return stat(name).then((stats: Stats): string => {

        if (stats.isDirectory()) {
            throw new Error("Invalid \"database-file\" : \"" + file + "\" is a directory, not a SQLite file");
        }

        return name;

    }, (err: NodeJS.ErrnoException): string => {

        // a missing file will be created
        if ("ENOENT" === err.code) {
            return name;
        }

        throw err;

    });

}
