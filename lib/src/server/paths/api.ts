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
    import type { paths, components } from "../../descriptor";

// module

    export function pathAPISwagger (req: Request, res: Response, next: NextFunction): void {

        readFile(join(__dirname, "..", "..", "..", "data", "descriptor.json"), "utf-8").then((content: string): void => {

            res.status(errorCodes.OK).json(JSON.parse(content) as paths["/api/descriptor"]["get"]["responses"]["200"]["content"]["application/json"]);

        }).catch(next);

    }

    export function pathAPIIps (req: Request, res: Response, next: NextFunction): void {

        getModel().getIps().then((ips: Array<components["schemas"]["IP"]>): void => {

            res.status(errorCodes.OK).json(ips as paths["/api/ips"]["get"]["responses"]["200"]["content"]["application/json"]);

        }).catch(next);

    }

    export function pathAPIAllRaces (req: Request, res: Response, next: NextFunction): void {

        getModel().getRaces().then((races: Array<components["schemas"]["BasicRace"]>): void => {

            res.status(errorCodes.OK).json(races as paths["/api/races"]["get"]["responses"]["200"]["content"]["application/json"]);

        }).catch(next);

    }

    export function pathAPIOneRace (req: Request, res: Response, next: NextFunction): void {

        getModel().getRace(req.params.race).then((race: components["schemas"]["Race"] | null): void => {

            if (race) {

                res.status(errorCodes.OK).json(race as paths["/api/races/{racecode}"]["get"]["responses"]["200"]["content"]["application/json"]);

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
        ).then((character: components["schemas"]["Character"] | null): void => {

            if (character) {

                res.status(errorCodes.OK).json(character as paths["/api/races/{racecode}/characters/{charactercode}"]["get"]["responses"]["200"]["content"]["application/json"]);

            }
            else {

                res.status(errorCodes.NOTFOUND).json({
                    "code": errorCodes.NOTFOUND,
                    "message": "Impossible to find \"" + req.params.character + "\" character for race \"" + req.params.race + "\""
                });

            }

        }).catch(next);

    }
