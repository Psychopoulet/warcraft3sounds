
"use strict";

// deps

	const { networkInterfaces } = require("os");
	const { join } = require("path");

	const Model = require(join(__dirname, "model.js"));

// consts

	const ROUTE = "/api/";
	const CODE_ERRORS = require(join(__dirname, "..", "returncodes.json"));

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

						if ("IPv4" !== iface.family || false !== iface.internal) {
							return;
						}
						else if (1 <= alias) {

							result.push({
								"address": iface.address,
								"name": ifname + "-" + alias
							});

						}
						else {

							result.push({
								"address": iface.address,
								"name": ifname
							});

						}

						++alias;

					});

				});

			res.status(CODE_ERRORS.OK).json(result);

		});

		return Promise.resolve();

	// all races
	}).then(() => {

		app.get(ROUTE + "races", (req, res) => {

			model.getRaces().then((races) => {

				races.forEach((race, i) => {
					races[i].url = ROUTE + "races/" + race.code;
				});

				res.status(CODE_ERRORS.OK).json(races);

			}).catch((err) => {

				res.status(CODE_ERRORS.INTERNAL).json({
					"code": CODE_ERRORS.INTERNAL,
					"message": err.message ? err.message : err
				});

			});

		});

		return Promise.resolve();

	// one race
	}).then(() => {

		app.get(ROUTE + "races/:race", (req, res) => {

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
						race.musics[i].url = ROUTE + "sounds/" + music.file;
					});

					race.warnings.forEach((warning, i) => {
						race.warnings[i].url = ROUTE + "sounds/" + warning.file;
					});

					res.status(CODE_ERRORS.OK).json(race);

				}

			}).catch((err) => {

				res.status(CODE_ERRORS.INTERNAL).json({
					"code": CODE_ERRORS.INTERNAL,
					"message": err.message ? err.message : err
				});

			});

		});

		return Promise.resolve();

	// characters
	}).then(() => {

		app.get(ROUTE + "races/:race/characters/:character", (req, res) => {

			model.getCharacter(req.params.race, req.params.character).then((character) => {

				if (!character) {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.character + "\" for race \"" + req.params.race + "\""
					});

				}
				else {

					character.actions.forEach((action, i) => {
						character.actions[i].url = ROUTE + "sounds/" + action.file;
					});

					res.status(CODE_ERRORS.OK).json(character);

				}

			}).catch((err) => {

				res.status(CODE_ERRORS.INTERNAL).json({
					"code": CODE_ERRORS.INTERNAL,
					"message": err.message ? err.message : err
				});

			});

		});

		return Promise.resolve();

	});

};
