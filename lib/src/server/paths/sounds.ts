// deps

    // natives
    import { createReadStream } from "node:fs";
    import { join, extname } from "node:path";

    // locals
    import errorCodes from "../../returncodes";
    import getFileStats from "../../tools/getFileStats";
    import getSoundsDirectory from "../../tools/getSoundsDirectory";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { operations } from "../../descriptor";

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

        if (stats.exists) {

            res.status(errorCodes.OK).set({
                "Content-Type": ".wav" === extname(file) ? "audio/wav" : "audio/mpeg",
                "Content-Length": stats.size
            });

            createReadStream(file).pipe(res);

        }
        else {

            const err: operations["getSound"]["responses"]["default"]["content"]["application/json"] = {
                "code": String(errorCodes.NOTFOUND),
                "message": "Impossible to find the \"" + sound + "\" sound"
            };

            res.status(errorCodes.NOTFOUND).json(err);

        }

    }).catch(next);

}
