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

    interface WatcherCategory {
        "category": string;
        "paths": Record<string, string>;
    }

   export type WatcherResult = WatcherValidResult | WatcherInvalidResult;

// consts

    const WATCHER_FILE = join(__dirname, "..", "..", "..", "..", "..", "data", "paths-watcher.json");

// module

export default function watcher (path: string): Promise<WatcherResult> {

    return readFile(WATCHER_FILE, "utf-8").then((data: string): WatcherResult => {

        const WATCHER: WatcherCategory[] = JSON.parse(data) as WatcherCategory[];

        for (const CATEGORY of WATCHER) {

            if (Object.hasOwn(CATEGORY.paths, path)) {

                return {
                    "isSuspicious": true,
                    "description": CATEGORY.paths[path]
                };

            }

        }

        return {
            "isSuspicious": false
        };

    });

}
