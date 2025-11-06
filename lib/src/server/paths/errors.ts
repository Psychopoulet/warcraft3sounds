// deps

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../returncodes";

    import logRequest from "../../tools/logRequest";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

// module

    export function pathErrorTest (req: Request, res: Response, next: NextFunction): void {
        next(new Error("This is a test error"));
    }

    export function pathErrorGlobal (err: Error, req: Request, res: Response, next: NextFunction): void {

        logRequest(req);
        console.error(err);

        if (res.headersSent) {
            return next(err);
        }
        else if (err instanceof error.NotFound) { // specific to express-openapi-validator

            res.status(errorCodes.NOTFOUND).json({
                "code": errorCodes.NOTFOUND,
                "message": "\"" + err.path + "\" not found"
            });

        }
        else {

            res.status(errorCodes.INTERNAL).json({
                "code": errorCodes.INTERNAL,
                "message": err.message
            });

        }

    }
