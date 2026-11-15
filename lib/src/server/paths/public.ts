// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // locals
    import getAppVersion from "../../tools/getAppVersion";
    import getAppGithub from "../../tools/getAppGithub";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

// module

    // main page

    export function pathPublicIndex (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "index.html"));
    }

    // app

    export function pathPublicApp (req: Request, res: Response, next: NextFunction): void {

        getAppVersion().then((version: string): Promise<void> => {

            return getAppGithub().then((github: string): Promise<void> => {

                return readFile(join(__dirname, "..", "..", "..", "..", "public", "dist", "bundle.min.js"), "utf-8").then((content: string): void => {

                    res.status(200).type("text/javascript").send(

                        content
                        .replace(/--APP_VERSION--/g, version)
                        .replace(/--GITHUB_URL--/g, github)

                    );

                });

            });

        }).catch((error: Error): void => {
            next(error);
        });

    }

    export function pathPublicAppMap (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "dist", "bundle.min.js.map"));
    }

    // robots

    export function pathPublicRobots (req: Request, res: Response): void {
        res.status(200).type("text/plain").send("User-agent: *\nDisallow: /\n");
    }

    // pictures

    export function pathPublicIconW3 (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3.png"));
    }

    export function pathPublicIconTFT (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
    }
