
// deps
	
	const path = require("path");
	const fs = require("fs");

// consts
	
	const VERSION = "v1";
	const ROUTE = "/api/" + VERSION + "/";

// module

module.exports = function WarcraftSoundsAPIV1(app) {

	const language = "fr";

	return new Promise((resolve, reject) => {

		fs.readdir(path.join(__dirname, "..", "data", language), (err, content) => {

			if (err) {
				reject(err);
			}
			else {

				let races = [];

					content.forEach((file) => {
						races.push(path.basename(file, ".json"));
					});

				resolve(races);

			}

		});

	}).then((races) => {

		app.get(ROUTE + "fr" + "/races", function (req, res) {
			res.status(200).json(races);
		});

		return Promise.resolve();

	}).then(() => {

		app.get(ROUTE + "fr" + "/races/:race", function (req, res) {

			fs.readFile(path.join(__dirname, "..", "data", language, req.params.race + ".json"), "utf8", (err, content) => {

				if (err) {

					res.status(404).json({
						code: "404",
						message: "Race \"" + req.params.race + "\" not found"
					});

				}
				else {

					res.status(200).json(content);

				}

			});

		});

		return Promise.resolve();

	});

};
