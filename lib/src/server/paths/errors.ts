/* eslint-disable n/callback-return */
// n/callback-return : incompatible lint rules in pathErrorGlobal

// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../returncodes";

    import getLogger from "../../tools/getLogger";
    import logRequest from "../../tools/logRequest";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

// consts

    const WATCHER_FILE = join(__dirname, "..", "..", "..", "data", "paths-watcher.json");

// module

    export default function pathErrorGlobal (err: Error, req: Request, res: Response, next: NextFunction): void {

        logRequest(req);

        if (res.headersSent) {
            next(err); return;
        }

        // handle managed error codes
        if (err instanceof error.NotFound) { // specific to express-openapi-validator

            readFile(WATCHER_FILE, "utf-8").then((data: string): void => {

                const WATCHER: Record<string, string> = JSON.parse(data) as Record<string, string>;
                const WATCHER_PATHS: string[] = Object.keys(WATCHER);

                if (WATCHER_PATHS.includes(req.path)) {
                    getLogger().error("INTRUSION ATTEMPT: " + req.path + "\n" + WATCHER[req.path]);
                }
                else {
                    getLogger().warning(err.message);
                }

            }).catch((errFile: Error): void => {
                getLogger().error(err.message);
                getLogger().error(errFile.message);
            });

            res.status(errorCodes.NOTFOUND).json({
                "code": String(errorCodes.NOTFOUND),
                "message": "not found" === err.message ? "\"" + err.path + "\" not found" : err.message
            });

        }
        else if (err instanceof error.BadRequest) { // specific to express-openapi-validator

            getLogger().warning(err.stack ?? err.message);

            res.status(errorCodes.BADREQUEST).json({
                "code": String(errorCodes.BADREQUEST),
                "message": err.message
            });

        }

        // InternalServerError (generic)
        else {

            getLogger().error(err.stack ?? err.message);

            res.status(errorCodes.INTERNAL).json({
                "code": String(errorCodes.INTERNAL),
                "message": err.message
            });

        }

    }
