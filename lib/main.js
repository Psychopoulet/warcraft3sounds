
"use strict";

// deps

	const { join } = require("path");

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");
	const fileupload = require("express-fileupload");

	const Conf = require("node-confmanager");

	const apiRoutes = require(join(__dirname, "api", "routes.js"));
	const soundsRoutes = require(join(__dirname, "soundsRoutes.js"));
	const webRoutes = require(join(__dirname, "webRoutes.js"));

// consts

	const APP = express();
	const CONF = new Conf(join(__dirname, "conf.json"));
	const CODE_ERRORS = require(join(__dirname, "returncodes.json"));

// module

	// init conf
	Promise.resolve().then(() => {

		return CONF.load().catch((err) => {
			(0, console).error("Impossible to initiate the configuration", err);
		});

	// add middlewares
	}).then(() => {

		APP
			.use(cors())
			.use(helmet())
			.use(compression())
			.use(fileupload())
			.use((err, req, res, next) => {

				if (res.headersSent) {
					next(err); return;
				}

				res.status(CODE_ERRORS.INTERNAL).send(
					"Ouups ! Something broke ! <br />" + (err.message ? err.message : err)
				);

			});

		return Promise.resolve();

	// add web routes
	}).then(() => {

		return webRoutes(APP).catch((err) => {
			(0, console).warn("Impossible to initiate web routes", err);
		});

	// add API routes
	}).then(() => {

		return apiRoutes(APP).catch((err) => {
			(0, console).warn("Impossible to initiate API routes", err);
		});

	// add sounds routes
	}).then(() => {

		return soundsRoutes(APP).catch((err) => {
			(0, console).warn("Impossible to initiate sounds routes", err);
		});

	// start listen port
	}).then(() => {

		APP.listen(CONF.get("port"), () => {
			(0, console).info("started on port", CONF.get("port"));
		});

		return Promise.resolve();

	}).catch((err) => {
		(0, console).error("Impossible to initiate the configuration", err);
	});
