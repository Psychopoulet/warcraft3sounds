// deps

    // locals
    import errorCodes from "../../returncodes";

// types & interfaces

    // externals
    import type { Request, Response } from "express";

// module

    export function pathHealth (req: Request, res: Response): void {

        res.status(errorCodes.OK).json({
            "status": "ok"
        });

    }
