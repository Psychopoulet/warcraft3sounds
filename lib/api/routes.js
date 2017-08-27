
"use strict";

// deps

	const { join, extname } = require("path");
	const { stat, createReadStream } = require("fs");

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

	// all races
	}).then(() => {

		app.get(ROUTE + "fr/races", (req, res) => {

			model.getRaces().then((races) => {

				races.forEach((race, i) => {
					races[i].url = ROUTE + "fr/races/" + race.code;
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

		app.get(ROUTE + "fr/races/:race", (req, res) => {

			model.getRace(req.params.race).then((race) => {

				if (!race) {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.race + "\""
					});

				}
				else {

					race.characters.forEach((character, i) => {
						race.characters[i].url = ROUTE + "fr/races/" + race.code + "/characters/" + character.code;
					});

					race.musics.forEach((music, i) => {
						race.musics[i].url = ROUTE + "fr/sounds/" + music.file;
					});

					race.warnings.forEach((warning, i) => {
						race.warnings[i].url = ROUTE + "fr/sounds/" + warning.file;
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

		app.get(ROUTE + "fr/races/:race/characters/:character", (req, res) => {

			model.getCharacter(req.params.race, req.params.character).then((character) => {

				if (!character) {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.character + "\" for race \"" + req.params.race + "\""
					});

				}
				else {

					character.actions.forEach((action, i) => {
						character.actions[i].url = ROUTE + "fr/sounds/" + action.file;
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

	// sound
	}).then(() => {

		app.get(ROUTE + "fr/sounds/:sound", (req, res) => {

			const file = join(__dirname, "..", "..", "sounds", req.params.sound);

			return new Promise((resolve) => {

				stat(file, (err, stats) => {
					resolve(!(err || !stats.isFile()));
				});

			}).then((exists) => {

				if (exists) {

					res.status(CODE_ERRORS.OK).set({
						"Content-Type": ".wav" === extname(file) ? "audio/wav" : "audio/mpeg"
					});

					createReadStream(file).pipe(res);

				}
				else {

					res.status(CODE_ERRORS.NOTFOUND).json({
						"code": CODE_ERRORS.NOTFOUND,
						"message": "Impossible to find \"" + req.params.sound + "\""
					});

				}

			});

		});

		return Promise.resolve();

	});

};
