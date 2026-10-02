// deps

    // natives
    import { mkdir, readFile, writeFile } from "node:fs/promises";
    import { join } from "node:path";

    // locals
    import { getLogsDirectory } from "./getLogger";

// consts

    const FILENAME = "watchers-to-check.txt";

    // calls are chained : concurrent requests must not overwrite each other's write
    let _queue: Promise<void> = Promise.resolve();

// private

    async function _read (file: string): Promise<string[]> {

        try {

            const content: string = await readFile(file, "utf8");

            return content.split("\n").filter((line: string): boolean => {
                return "" !== line;
            });

        }
        catch (err: unknown) {

            if ("ENOENT" === (err as NodeJS.ErrnoException).code) {
                return [];
            }

            throw err;

        }

    }

    async function _add (path: string): Promise<void> {

        const directory: string = getLogsDirectory();
        const file: string = join(directory, FILENAME);

        await mkdir(directory, {
            "recursive": true
        });

        const paths: Set<string> = new Set(await _read(file));

        paths.add(path);

        await writeFile(file, [ ...paths ].sort().join("\n"), "utf8");

    }

// module

export default function addWatcherToCheck (path: string): Promise<void> {

    const result: Promise<void> = _queue.then((): Promise<void> => {
        return _add(path);
    });

    // a failure must not block the following calls
    _queue = result.catch((): void => {
        // nothing to do : the caller handles the error through "result"
    });

    return result;

}
