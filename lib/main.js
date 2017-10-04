
"use strict";

// deps

	const { join } = require("path");

	const generateServer = require(join(__dirname, "server", "generateServer.js"));
	const webRoutes = require(join(__dirname, "server", "webRoutes.js"));
	const soundsRoutes = require(join(__dirname, "server", "soundsRoutes.js"));
	const apiRoutes = require(join(__dirname, "api", "routes.js"));

// module

	// generate web server
	Promise.resolve().then(() => {

		return generateServer().then((APP) => {
			return Promise.resolve(APP);
		}).catch((err) => {
			(0, console).error("Impossible to generate server", err);
		});

	// add web routes
	}).then((APP) => {

		return webRoutes(APP).then(() => {
			return Promise.resolve(APP);
		}).catch((err) => {
			(0, console).error("Impossible to initiate web routes", err);
		});

	// add API routes
	}).then((APP) => {

		return apiRoutes(APP).then(() => {
			return Promise.resolve(APP);
		}).catch((err) => {
			(0, console).error("Impossible to initiate API routes", err);
		});

	// add sounds routes
	}).then((APP) => {

		return soundsRoutes(APP).then(() => {
			return Promise.resolve(APP);
		}).catch((err) => {
			(0, console).error("Impossible to initiate sounds routes", err);
		});

	// start listen port
	}).then((APP) => {

		const ARGS = process.argv.slice(2);
		const PORT = ARGS.length ? ARGS[0] : 3000;

		APP.use((err, req, res, next) => {

			(0, console).log(err);

			return res.headersSent ?
				next(err) :
				res.status(500).send(
				"Ouups ! Something broke !"
			);

		}).listen(PORT, () => {
			(0, console).info("started on port", PORT);
		});

	}).catch((err) => {
		(0, console).error("Impossible to initiate the configuration", err);
	});
