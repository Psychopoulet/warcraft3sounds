
"use strict";

// deps

	const { join } = require("path");

	const Conf = require("node-confmanager");

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

		const conf = new Conf(join(__dirname, "conf.json"));

		// init conf
		return Promise.resolve().then(() => {

			return conf.load().catch((err) => {
				(0, console).error("Impossible to initiate the configuration", err);
			});

		}).then(() => {

			APP.use((err, req, res, next) => {

				(0, console).log(err);

				return res.headersSent ?
					next(err) :
					res.status(500).send(
					"Ouups ! Something broke !"
				);

			}).listen(conf.get("port"), () => {
				(0, console).info("started on port", conf.get("port"));
			});

		});

	}).catch((err) => {
		(0, console).error("Impossible to initiate the configuration", err);
	});
