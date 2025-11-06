// deps

    // natives
    import { join, extname } from "node:path";
    import { createReadStream } from "node:fs";

    // locals
    import errorCodes from "../../returncodes";
    import getFileStats from "../../tools/getFileStats";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { paths } from "../../descriptor";

// module

export function pathSounds (req: Request, res: Response, next: NextFunction): void {

    const sound: paths["/public/sounds/{sound}"]["get"]["parameters"]["path"]["sound"] = req.params.sound;
    const file: string = join(__dirname, "..", "..", "..", "..", "public", "sounds", sound);

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

            res.status(errorCodes.NOTFOUND).json({
                "code": String(errorCodes.NOTFOUND),
                "message": "Impossible to find the \"" + sound + "\" sound"
            } as paths["/public/sounds/{sound}"]["get"]["responses"]["default"]["content"]["application/json"]);

        }

    }).catch(next);

}
