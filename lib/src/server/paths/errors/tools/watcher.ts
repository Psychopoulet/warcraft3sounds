// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

// types & interfaces

    // locals
    interface WatcherValidResult {
        "isSuspicious": false;
    }

    interface WatcherInvalidResult {
        "isSuspicious": true;
        "description": string;
    }

   export type WatcherResult = WatcherValidResult | WatcherInvalidResult;

// consts

    const WATCHER_FILE = join(__dirname, "..", "..", "..", "..", "..", "data", "paths-watcher.json");

// module

export default function watcher (path: string): Promise<WatcherResult> {

    return readFile(WATCHER_FILE, "utf-8").then((data: string): WatcherResult => {

        const WATCHER: Record<string, string> = JSON.parse(data) as Record<string, string>;
        const WATCHER_PATHS: string[] = Object.keys(WATCHER);

        if (!WATCHER_PATHS.includes(path)) {

            return {
                "isSuspicious": false
            };

        }

        return {
            "isSuspicious": true,
            "description": WATCHER[path]
        };

    });

}
