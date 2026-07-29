// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // locals
    import errorCodes from "../../returncodes";
    import getModel from "../../model";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { operations } from "../../descriptor";

// module

    export function pathAPISwagger (req: Request, res: Response, next: NextFunction): void {

        readFile(join(__dirname, "..", "..", "..", "data", "descriptor.json"), "utf-8").then((content: string): void => {

            res.status(errorCodes.OK).json(JSON.parse(content) as operations["getDescriptor"]["responses"]["200"]["content"]["application/json"]);

        }).catch(next);

    }

    export function pathAPIIps (req: Request, res: Response, next: NextFunction): void {

        getModel().getIps().then((ips: operations["getIPs"]["responses"]["200"]["content"]["application/json"]): void => {

            res.status(errorCodes.OK).json(ips);

        }).catch(next);

    }

    export function pathAPIAllRaces (req: Request, res: Response, next: NextFunction): void {

        getModel().getRaces().then((races: operations["getRaces"]["responses"]["200"]["content"]["application/json"]): void => {

            res.status(errorCodes.OK).json(races);

        }).catch(next);

    }

    export function pathAPIOneRace (req: Request, res: Response, next: NextFunction): void {

        getModel().getRace(req.params.race).then((race: operations["getRace"]["responses"]["200"]["content"]["application/json"] | null): void => {

            if (race) {

                res.status(errorCodes.OK).json(race);

            }
            else {

                res.status(errorCodes.NOTFOUND).json({
                    "code": errorCodes.NOTFOUND,
                    "message": "Impossible to find \"" + req.params.race + "\" race"
                });

            }

        }).catch(next);

    }

    export function pathAPIOneCharacter (req: Request, res: Response, next: NextFunction): void {

        let notworded: boolean = false;

        if ("object" === typeof req.query) {

            if ("boolean" === typeof req.query.notworded) {
                notworded = req.query.notworded;
            }
            else if ("string" === typeof req.query.notworded) {
                notworded = "true" === req.query.notworded || "1" === req.query.notworded;
            }
            else if ("number" === typeof req.query.notworded) {
                notworded = 1 === req.query.notworded;
            }

        }

        getModel().getCharacter(
            req.params.race,
            req.params.character,
            notworded
        ).then((character: operations["getCharacter"]["responses"]["200"]["content"]["application/json"] | null): void => {

            if (character) {

                res.status(errorCodes.OK).json(character);

            }
            else {

                res.status(errorCodes.NOTFOUND).json({
                    "code": errorCodes.NOTFOUND,
                    "message": "Impossible to find \"" + req.params.character + "\" character for race \"" + req.params.race + "\""
                });

            }

        }).catch(next);

    }
