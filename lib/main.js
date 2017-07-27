
"use strict";

// deps

	const path = require("path");

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");

	const Conf = require("node-confmanager");

	const apiv1routes = require(path.join(__dirname, "api", "v1", "routes.js"));

// consts

	const APP = express();
	const CONF = new Conf(path.join(__dirname, "conf.json"));
	const CODE_ERRORS = require(path.join(__dirname, "returncodes.json"));
	const CONSOLE_WRAPPER_NUMBER = 0;

// module

	CONF.load().then(() => {

		APP
			.use(cors())
			.use(helmet())
			.use(compression())
			.use((err, req, res, next) => {

				if (res.headersSent) {
					next(err); return;
				}

				res.status(CODE_ERRORS.INTERNAL).send(
					"Ouups ! Something broke ! <br />" + (err.message ? err.message : err)
				);

			});

		// main page

		APP.get("/", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "index.html"));
		})
		.get("/public/app.js", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "app.js"));
		})

		// pictures

		.get("/public/pictures/warcraft3.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3.png"));
		})
		.get("/public/pictures/warcraft3TFT.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3TFT.png"));
		});

		// add API V1 routes

		apiv1routes(APP).catch((err) => {
			(CONSOLE_WRAPPER_NUMBER, console).log("Impossible to initiate the API (V1)");
			(CONSOLE_WRAPPER_NUMBER, console).log(err);
		});

		APP.listen(CONF.get("port"), () => {
			(CONSOLE_WRAPPER_NUMBER, console).log("started on port", CONF.get("port"));
		});

	})
	.catch((err) => {
		(CONSOLE_WRAPPER_NUMBER, console).log("Impossible to initiate the configuration");
		(CONSOLE_WRAPPER_NUMBER, console).log(err);
	});
