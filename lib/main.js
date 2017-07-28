
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
			console.warn("Impossible to initiate the API (V1)", err);
		});

		APP.listen(CONF.get("port"), () => {
			console.info("started on port", CONF.get("port"));
		});

	})
	.catch((err) => {
		console.error("Impossible to initiate the configuration", err);
	});
