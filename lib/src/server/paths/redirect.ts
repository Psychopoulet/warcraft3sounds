// deps

    // locals
    import errorCodes from "../../returncodes";
    import logRequest from "../../tools/logRequest";

    // types & interfaces

    // externals
    import type { Request, Response } from "express";

// module

    export function redirect (path: string): (req: Request, res: Response) => void {

        return function pathRedirection (req: Request, res: Response): void {

            logRequest(req);
            console.error("Redirected to", path);

            res.set("location", path);
            res.status(errorCodes.REDIRECT).send("Redirected to \"" + path + "\"");

        };

    }
