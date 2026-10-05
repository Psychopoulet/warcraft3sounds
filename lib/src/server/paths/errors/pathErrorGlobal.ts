// deps

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../../returncodes";

    import getLogger from "../../../tools/getLogger";
    import logRequest from "../../../tools/logRequest";

    import addWatcherToCheck from "./tools/addWatcherToCheck";
    import ipWatcher from "./tools/ipWatcher";
    import watcher from "./tools/watcher";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { WatcherResult } from "./tools/watcher";

// module

    export default function pathErrorGlobal (err: Error, req: Request, res: Response, next: NextFunction): void {

        logRequest(req);

        if (res.headersSent) {
            next(err); return;
        }

        // handle managed error codes
        if (err instanceof error.NotFound) { // specific to express-openapi-validator

            watcher(req.path).then((result: WatcherResult): void => {

                if (result.isSuspicious) {
                    getLogger().error("INTRUSION ATTEMPT: \"" + req.path + "\" => " + result.description);
                }
                else {

                    getLogger().warning(err.message);

                    addWatcherToCheck(req.path).catch((errAdd: Error): void => {
                        getLogger().error(errAdd.message);
                    });

                }

            }).catch((errFile: Error): void => {
                getLogger().error(err.message);
                getLogger().error(errFile.message);
            });

            // a listed IP is flagged even when the path itself is not suspicious
            ipWatcher(req.ip ?? "").then((result: WatcherResult): void => {

                if (result.isSuspicious) {
                    getLogger().error("INTRUSION ATTEMPT: IP \"" + String(req.ip) + "\" => " + result.description);
                }

            }).catch((errFile: Error): void => {
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
