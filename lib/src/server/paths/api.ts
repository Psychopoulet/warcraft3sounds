// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import { error } from "express-openapi-validator";

    // locals
    import errorCodes from "../../returncodes";
    import getModel from "../../db/model";

// types & interfaces

    // externals
    import type { Request, Response, NextFunction } from "express";

    // locals
    import type { operations } from "../../Descriptor";

// module

    export function pathAPISwagger (req: Request, res: Response, next: NextFunction): void {

        readFile(join(__dirname, "..", "..", "..", "data", "Descriptor.json"), "utf-8").then((content: string): void => {

            res.status(errorCodes.OK).json(JSON.parse(content) as operations["getDescriptor"]["responses"]["200"]["content"]["application/json"]);

        }).catch(next);

    }

    export function pathAPIAllRaces (req: Request, res: Response, next: NextFunction): void {

        getModel().getRaces().then((races: operations["getRaces"]["responses"]["200"]["content"]["application/json"]): void => {

            res.status(errorCodes.OK).json(races);

        }).catch(next);

    }

    export function pathAPIOneRace (
        req: Request<operations["getRace"]["parameters"]["path"]>,
        res: Response,
        next: NextFunction
    ): void {

        getModel().getRace(req.params.racecode).then((race: operations["getRace"]["responses"]["200"]["content"]["application/json"] | null): void => {

            if ("undefined" === typeof race || null === race) {

                throw new error.NotFound({
                    "path": req.path,
                    "message": "Impossible to find \"" + req.params.racecode + "\" race"
                });

            }

            res.status(errorCodes.OK).json(race);

        }).catch(next);

    }

    export function pathAPIOneCharacter (
        req: Request<operations["getCharacter"]["parameters"]["path"]>,
        res: Response,
        next: NextFunction
    ): void {

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
            req.params.racecode,
            req.params.charactercode,
            notworded
        ).then((character: operations["getCharacter"]["responses"]["200"]["content"]["application/json"] | null): void => {

            if ("undefined" === typeof character || null === character) {

                throw new error.NotFound({
                    "path": req.path,
                    "message": "Impossible to find \"" + req.params.charactercode + "\" character for race \"" + req.params.racecode + "\""
                });

            }

            res.status(errorCodes.OK).json(character);

        }).catch(next);

    }
