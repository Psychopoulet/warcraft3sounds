// deps

    // natives
    import { mkdir, readFile, writeFile } from "node:fs/promises";
    import { join } from "node:path";

    // locals
    import { getLogsDirectory } from "../../../../tools/getLogger";

// consts

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

    async function _add (filename: string, values: string[]): Promise<void> {

        const directory: string = getLogsDirectory();
        const file: string = join(directory, filename);

        await mkdir(directory, {
            "recursive": true
        });

        const vals: Set<string> = new Set(await _read(file));

        for (const value of values) {
            vals.add(value);
        }

        await writeFile(file, [ ...vals ].sort().join("\n"), "utf8");

    }

// module

// resolves once every write requested so far is done (a failed write is already reported to its caller)
export function waitToCheckFiles (): Promise<void> {
    return _queue;
}

export default function addToCheckFile (filename: string, values: string[]): Promise<void> {

    const result: Promise<void> = _queue.then((): Promise<void> => {
        return _add(filename, values);
    });

    // a failure must not block the following calls
    _queue = result.catch((): void => {
        // nothing to do : the caller handles the error through "result"
    });

    return result;

}
