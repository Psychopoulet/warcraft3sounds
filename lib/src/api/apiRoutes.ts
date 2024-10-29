// deps

	// natives
	import { join } from "node:path";
	import { networkInterfaces } from "node:os";

// types & interfaces

	// natives
	import type { NetworkInterfaceInfo } from "node:os";

	// externals
	import type { Express, Request, Response, NextFunction } from "express";

	// locals
	import Model from "./model";

	interface iAddress {
		"address": string;
		"name": string;
	}

// consts

	const ROUTE: string = "/api/";
	const SOUNDS_ROUTE: string = "/public/sounds/";
	const CODE_ERRORS: Record<string, number> = require(join(__dirname, "..", "..", "data", "returncodes.json"));

// module

export default function apiRoutes (app: Express): Promise<void> {

	const model: Model = new Model();

	return model.init().then((): void => {

		app.get(ROUTE + "ips", (req: Request, res: Response): void => {

			const result: iAddress[] = [];

				const ifaces: NodeJS.Dict<NetworkInterfaceInfo[]> = networkInterfaces();

				Object.keys(ifaces).forEach((ifname: string): void => {

					let alias: number = 0;

					(ifaces[ifname] as NetworkInterfaceInfo[]).forEach((iface: NetworkInterfaceInfo): void => {

						if ("IPv4" === iface.family && false === iface.internal) {

							result.push({
								"address": iface.address,
								"name": 1 <= alias ? ifname + "-" + alias : ifname
							});

							++alias;

						}

					});

				});

			res.status(CODE_ERRORS.OK).json(result);

		});

	// all races
	}).then((): void => {

		app.get(ROUTE + "races", (req: Request, res: Response, next: NextFunction): void => {

			model.getRaces().then((races) => {

				races.forEach((race, i) => {
					races[i].url = ROUTE + "races/" + race.code;
				});

				res.status(CODE_ERRORS.OK).json(races);

			}).catch(next);

		});

	// one race
	}).then((): void => {

		app.get(ROUTE + "races/:race", (req: Request, res: Response, next: NextFunction): void => {

			model.getRace(req.params.race).then((race) => {

				if (!race) {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.race + "\""
					});

				}
				else {

					race.characters.forEach((character, i) => {
						race.characters[i].url = ROUTE + "races/" + race.code + "/characters/" + character.code;
					});

					race.musics.forEach((music, i) => {
						race.musics[i].url = SOUNDS_ROUTE + music.file;
					});

					race.warnings.forEach((warning, i) => {
						race.warnings[i].url = SOUNDS_ROUTE + warning.file;
					});

					res.status(CODE_ERRORS.OK).json(race);

				}

			}).catch(next);

		});

	// characters
	}).then((): void => {

		app.get(ROUTE + "races/:race/characters/:character", (req: Request, res: Response, next: NextFunction): void => {

			model.getCharacter(
				req.params.race,
				req.params.character,
				req.query && "undefined" !== typeof req.query.notworded ? Boolean(req.query.notworded) : false
			).then((character) => {

				if (!character) {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.character + "\" for race \"" + req.params.race + "\""
					});

				}
				else {

					character.actions.forEach((action, i) => {
						character.actions[i].url = SOUNDS_ROUTE + action.file;
					});

					res.status(CODE_ERRORS.OK).json(character);

				}

			}).catch(next);

		});

	// test error
	}).then((): void => {

		app.get(ROUTE + "err", (req: Request, res: Response, next: NextFunction): void => {
			next(new Error("This is a test error"));
		});

	});

};
