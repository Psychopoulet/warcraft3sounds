// deps

	// natives
	import { join, extname } from "node:path";
	import { stat, createReadStream } from "node:fs";

// consts

	const CODE_ERRORS = require(join(__dirname, "returncodes.json"));

// module

export default function soundsRoutes (app) {

	return Promise.resolve().then(() => {

		app.get("/public/sounds/:sound", (req, res) => {

			const file = join(__dirname, "..", "public", "sounds", req.params.sound);

			new Promise((resolve) => {

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

					res.status(CODE_ERRORS.NOTFOUND).send("Impossible to find \"" + req.params.sound + "\"");

				}

			});

		});

		return Promise.resolve();

	});

}
