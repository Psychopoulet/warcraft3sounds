// deps

    // locals
    import errorCodes from "../returncodes";
	import Model from "./model";

// types & interfaces

	// externals
	import type { Express, Request, Response, NextFunction } from "express";

	// locals
	import type { iBasicDataWithUrl, iCharacter, iIp, iRace } from "./model";

// module

export default function apiRoutes (app: Express): Promise<void> {

	const model: Model = new Model();

	return model.init().then((): void => {

		app.get("/api/ips", (req: Request, res: Response, next: NextFunction): void => {

			model.getIps().then((ips: iIp[]): void => {

				res.status(errorCodes.OK).json(ips);

			}).catch(next);

		});

	// all races
	}).then((): void => {

		app.get("/api/races", (req: Request, res: Response, next: NextFunction): void => {

			model.getRaces().then((races: iBasicDataWithUrl[]): void => {

				res.status(errorCodes.OK).json(races);

			}).catch(next);

		});

	// one race
	}).then((): void => {

		app.get("/api/races/:race", (req: Request, res: Response, next: NextFunction): void => {

			model.getRace(req.params.race).then((race: iRace | null): void => {

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

		});

	// characters
	}).then((): void => {

		app.get("/api/races/:race/characters/:character", (req: Request, res: Response, next: NextFunction): void => {

			model.getCharacter(
				req.params.race,
				req.params.character,
				req.query && "undefined" !== typeof req.query.notworded ? Boolean(req.query.notworded) : false
			).then((character: iCharacter | null): void => {

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

		});

	// test error
	}).then((): void => {

		app.get("/api/err", (req: Request, res: Response, next: NextFunction): void => {
			next(new Error("This is a test error"));
		});

	});

};
