// deps

    // natives
    import { createReadStream } from "node:fs";
    import { join, extname } from "node:path";

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../returncodes";
    import getFileStats from "../../tools/getFileStats";
    import getSoundsDirectory from "../../tools/getSoundsDirectory";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { operations } from "../../Descriptor";

// module

export function pathSounds (
    req: Request<operations["getSound"]["parameters"]["path"]>,
    res: Response,
    next: NextFunction
): void {

    const { sound } = req.params;
    const file: string = join(getSoundsDirectory(), sound);

    getFileStats(file).then((stats: {
        "exists": boolean;
        "size": number;
    }): void => {

        if (!stats.exists) {

            throw new error.NotFound({
                "path": req.path,
                "message": "Impossible to find the \"" + sound + "\" sound"
            });

        }

        res.status(errorCodes.OK).set({
            "Content-Type": ".wav" === extname(file) ? "audio/wav" : "audio/mpeg",
            "Content-Length": stats.size
        });

        createReadStream(file).pipe(res);

    }).catch(next);

}
