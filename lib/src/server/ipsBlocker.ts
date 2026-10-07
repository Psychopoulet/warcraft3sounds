// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import extractIps from "../tools/extractIps";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    interface WatcherIps {
        "category": string;
        "ips": Record<string, string>;
    }

// private

    function _checkIps (currentIps: string[], watchers: WatcherIps[]): boolean {

        return watchers.some((watcher: WatcherIps): boolean => {

            return Object.keys(watcher.ips).some((ip: string): boolean => {
                return currentIps.includes(ip);
            });

        });

    }

// module

export default async function ipsBlocker (req: Request, res: Response, next: NextFunction): Promise<void> {

    return readFile(join(__dirname, "..", "..", "data", "watchers", "ips.json"), "utf-8").then((content: string): void => {

        const currentIps: string[] = extractIps(req);
        const watchedIps: WatcherIps[] = JSON.parse(content) as WatcherIps[];

        if (_checkIps(currentIps, watchedIps)) {

            throw new error.Forbidden({
                "path": req.path,
                "message": "You are not allowed to access this resource"
            });

        }

        return next();

    });

}
