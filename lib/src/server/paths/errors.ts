/* eslint-disable n/callback-return */
// n/callback-return : incompatible lint rules in pathErrorGlobal

// deps

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../returncodes";

    import getLogger from "../../tools/getLogger";
    import logRequest from "../../tools/logRequest";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

// module

    export default function pathErrorGlobal (err: Error, req: Request, res: Response, next: NextFunction): void {

        logRequest(req);
        getLogger().error(err.stack ?? err.message);

        if (res.headersSent) {
            next(err);
        }

        // handle managed error codes
        else if (err instanceof error.NotFound) { // specific to express-openapi-validator

            res.status(errorCodes.NOTFOUND).json({
                "code": String(errorCodes.NOTFOUND),
                "message": "not found" === err.message ? "\"" + err.path + "\" not found" : err.message
            });

        }
        else if (err instanceof error.BadRequest) { // specific to express-openapi-validator

            res.status(errorCodes.BADREQUEST).json({
                "code": String(errorCodes.BADREQUEST),
                "message": err.message
            });

        }

        // InternalServerError (generic)
        else {

            res.status(errorCodes.INTERNAL).json({
                "code": String(errorCodes.INTERNAL),
                "message": err.message
            });

        }

    }
