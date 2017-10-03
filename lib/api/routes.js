
"use strict";

// deps

	const { networkInterfaces } = require("os");
	const { join } = require("path");

	const Model = require(join(__dirname, "model.js"));

// consts

	const ROUTE = "/api/";
	const SOUNDS_ROUTE = "/public/sounds/";
	const CODE_ERRORS = require(join(__dirname, "..", "server", "returncodes.json"));

// module

module.exports = (app) => {

	let model = null;

	// init model
	return new Promise((resolve) => {
		model = new Model();
		resolve();
	}).then(() => {
		return model.init();

	// ips
	}).then(() => {

		app.get(ROUTE + "ips", (req, res) => {

			const result = [];

				const ifaces = networkInterfaces();

				Object.keys(ifaces).forEach((ifname) => {

					let alias = 0;

					ifaces[ifname].forEach((iface) => {

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

		return Promise.resolve();

	// all races
	}).then(() => {

		app.get(ROUTE + "races", (req, res, next) => {

			model.getRaces().then((races) => {

				races.forEach((race, i) => {
					races[i].url = ROUTE + "races/" + race.code;
				});

				res.status(CODE_ERRORS.OK).json(races);

			}).catch(next);

		});

		return Promise.resolve();

	// one race
	}).then(() => {

		app.get(ROUTE + "races/:race", (req, res, next) => {

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

		return Promise.resolve();

	// characters
	}).then(() => {

		app.get(ROUTE + "races/:race/characters/:character", (req, res, next) => {

			model.getCharacter(req.params.race, req.params.character).then((character) => {

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

		return Promise.resolve();

	// error
	}).then(() => {

		app.get(ROUTE + "err", (req, res, next) => {

			next(new Error("This is a test error"));

		}).use((err, req, res, next) => {

			(0, console).log(err);

			return res.headersSent ? next(err) : res.status(CODE_ERRORS.INTERNAL).json({
				"code": CODE_ERRORS.INTERNAL,
				"message": err.message ? err.message : err
			});

		});

		return Promise.resolve();

	});

};
