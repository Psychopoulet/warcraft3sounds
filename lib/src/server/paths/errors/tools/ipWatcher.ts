// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

// types & interfaces

    // locals
    import type { WatcherResult } from "./watcher";

    interface IpWatcherCategory {
        "category": string;
        "ips": Record<string, string>;
    }

// consts

    const IP_WATCHER_FILE = join(__dirname, "..", "..", "..", "..", "..", "data", "ip-watcher.json");
    const IPV4_MAPPED_PREFIX = "::ffff:";

// private

    // "::ffff:1.2.3.4" (IPv4-mapped IPv6) => "1.2.3.4"
    function _normalize (ip: string): string {

        return ip.toLowerCase().startsWith(IPV4_MAPPED_PREFIX) ? ip.slice(IPV4_MAPPED_PREFIX.length) : ip;

    }

// module

export default function ipWatcher (ip: string, file: string = IP_WATCHER_FILE): Promise<WatcherResult> {

    const NORMALIZED: string = _normalize(ip);

    return readFile(file, "utf-8").then((data: string): WatcherResult => {

        const WATCHER: IpWatcherCategory[] = JSON.parse(data) as IpWatcherCategory[];

        for (const CATEGORY of WATCHER) {

            if (Object.hasOwn(CATEGORY.ips, NORMALIZED)) {

                return {
                    "isSuspicious": true,
                    "description": CATEGORY.ips[NORMALIZED]
                };

            }

        }

        return {
            "isSuspicious": false
        };

    });

}
