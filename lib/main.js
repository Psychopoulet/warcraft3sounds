
"use strict";

// deps

	const { join } = require("path");

	const generateServer = require(join(__dirname, "server", "generateServer.js"));
	const webRoutes = require(join(__dirname, "server", "webRoutes.js"));
	const soundsRoutes = require(join(__dirname, "server", "soundsRoutes.js"));
	const apiRoutes = require(join(__dirname, "api", "routes.js"));

	const ConfManager = require("node-confmanager");
	const SimpleSSL = require("simplessl");

// module

	Promise.resolve().then(() => {

		const conf = new ConfManager();

		// generate web server
		Promise.resolve().then(() => {

			conf.skeleton("port", "integer").document("port", "Port used by the server");
			conf.skeleton("ssl", "boolean").document("ssl", "Is SSL activated ?");

			return conf.load().then(() => {

				conf.set("port", conf.has("port") ? conf.get("port") : 3000);
				conf.set("ssl", conf.has("ssl") ? conf.get("ssl") : false);

				return generateServer(conf);

			}).then((APP) => {
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

		// catch error
		}).then((APP) => {

			APP.use((err, req, res, next) => {

				(0, console).log(err);

				return res.headersSent ?
					next(err) :
					res.status(500).send(
					"Ouups ! Something broke !"
				);

			});

			return Promise.resolve(APP);

		// generate server
		}).then((APP) => {

			return !conf.get("ssl") ? Promise.resolve().then(() => {

				return Promise.resolve(
					require("http").createServer(APP)
				);

			}) : Promise.resolve().then(() => {

				const ssl = new SimpleSSL();

				const serverkey = join(__dirname, "server.key");
				const servercsr = join(__dirname, "server.csr");
				const servercrt = join(__dirname, "server.crt");

				return ssl.createCertificate(serverkey, servercsr, servercrt, "medium").then((keys) => {

					return Promise.resolve(require("https").createServer({
						"key": keys.privateKey,
						"cert": keys.certificate
					}, APP));

				});

			});

		// run server
		}).then((server) => {

			server.listen(conf.get("port"), () => {
				(0, console).info("started" + (conf.get("ssl") ? " with SSL" : "") + " on port " + conf.get("port"));
			});

		}).catch((err) => {
			(0, console).error("Impossible to initiate the configuration", err);
		});

	});
