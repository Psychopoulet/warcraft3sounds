
// deps
	
	const os = require("os");
	const path = require("path");
	const fs = require("fs");

	const Model = require(path.join(__dirname, "model.js"));

// consts
	
	const VERSION = "v1";
	const ROUTE = "/api/" + VERSION + "/";

// module

module.exports = function WarcraftSoundsAPIV1Routes(app) {

	const language = "fr";
	var model = null;

	// init model
	return new Promise((resolve) => {
		model = new Model(); resolve();
	}).then(() => {
		return model.init();

	// all races
	}).then(() => {

		app.get(ROUTE + "fr" + "/races", function (req, res) {

			model.getRaces().then((races) => {

				races.forEach((race, i) => {
					races[i].url = ROUTE + "fr" + "/races/" + race.code;
				});

				res.status(200).json(races);
				
			}).catch((err) => {

				res.status(500).json({
					code: "500",
					message: (err.message) ? err.message : err
				});

			});

		});

		return Promise.resolve();

	// one race
	}).then(() => {

		app.get(ROUTE + "fr" + "/races/:race", function (req, res) {

			model.getRace(req.params.race).then((race) => {

				if (!race) {

					res.status(404).json({
						code: "404",
						message: "Impossible to find \"" + req.params.race + "\""
					});

				}
				else {

					race.characters.forEach((character, i) => {
						race.characters[i].url = ROUTE + "fr" + "/races/" + race.code + "/characters/" + character.code;
					});

					race.musics.forEach((music, i) => {
						race.musics[i].url = ROUTE + "fr" + "/sounds/" + music.file;
					});

					race.warnings.forEach((warning, i) => {
						race.warnings[i].url = ROUTE + "fr" + "/sounds/" + warning.file;
					});

					res.status(200).json(race);
					
				}
				
			}).catch((err) => {

				res.status(500).json({
					code: "500",
					message: (err.message) ? err.message : err
				});

			});

		});

		return Promise.resolve();

	// characters
	}).then(() => {

		app.get(ROUTE + "fr" + "/races/:race/characters/:character", function (req, res) {

			model.getCharacter(req.params.race, req.params.character).then((character) => {

				if (!character) {

					res.status(404).json({
						code: "404",
						message: "Impossible to find \"" + req.params.character + "\" for race \"" + req.params.race + "\""
					});

				}
				else {

					character.actions.forEach((action, i) => {
						character.actions[i].url = ROUTE + "fr" + "/sounds/" + action.file;
					});

					res.status(200).json(character);

				}
				
			}).catch((err) => {

				res.status(500).json({
					code: "500",
					message: (err.message) ? err.message : err
				});

			});

		});

		return Promise.resolve();

	// sound
	}).then(() => {

		app.get(ROUTE + "fr" + "/sounds/:sound", function (req, res) {

			let file = path.join(__dirname, "..", "..", "sounds", req.params.sound);

			return new Promise((resolve) => {

				fs.stat(file, (err, stats) => {
					resolve(!(err || !stats.isFile()));
				});

			}).then((exists) => {

				if (exists) {

					res.status(200).set({"Content-Type": ".wav" === path.extname(file) ? "audio/wav" : "audio/mpeg"});
					fs.createReadStream(file).pipe(res);

				}
				else {

					res.status(404).json({
						code: "404",
						message: "Impossible to find \"" + req.params.sound + "\""
					});

				}

			});

		});

		return Promise.resolve();

	// ips
	}).then(() => {

		app.get(ROUTE + "ips", (req, res) => {
			
			let ifaces = os.networkInterfaces();

			let result = [];

			Object.keys(ifaces).forEach((ifname) => {

				let alias = 0;

				ifaces[ifname].forEach((iface) => {

					if ("IPv4" !== iface.family || false !== iface.internal) {
						return;
					}
					else if (alias >= 1) {

						result.push({
							name: ifname + "-" + alias,
							address: iface.address
						});

					}
					else {

						result.push({
							name: ifname,
							address: iface.address
						});
						
					}

					++alias;

				});

			});

			res.status(200).json(result);

		});

		return Promise.resolve();

	});

};
