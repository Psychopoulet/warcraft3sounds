// deps

    // locals
    import errorCodes from "../../returncodes";

    import logRequest from "../../tools/logRequest";
    import getRequestPath from "../../tools/getRequestPath";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

// module

    export function pathErrorTest (req: Request, res: Response, next: NextFunction): void {
        next(new Error("This is a test error"));
    }

    export function pathErrorNotFound (req: Request, res: Response, next: NextFunction): void {

        logRequest(req);
        console.error("Not found");

        if (res.headersSent) {
            return next("Not found");
        }
        else {

            res.status(errorCodes.NOTFOUND).json({
                "code": errorCodes.NOTFOUND,
                "message": getRequestPath(req) + " not found"
            });

        }

    }

    export function pathErrorGlobal (err: Error, req: Request, res: Response, next: NextFunction): void {

        logRequest(req);

        console.error(err);

        if (res.headersSent) {
            return next(err);
        }
        else {

            res.status(errorCodes.INTERNAL).json({
                "code": errorCodes.INTERNAL,
                "message": err.message
            });

        }

    }
