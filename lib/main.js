
"use strict";

// deps
	
	const path = require("path");

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");

	const conf = require("node-confmanager");

	const APIV1Routes = require(path.join(__dirname, "api", "v1", "routes.js"));

// consts

	const CURRENT_API = 1;

// private

	// attributes

		var _app = express();
		var _conf = new conf(path.join(__dirname, "conf.json"));

// module

	_conf.load().then(() => {

		_app
			.use(cors())
			.use(helmet())
			.use(compression())
			.use((err, req, res, next) => {
				res.status(500).send("Ouups ! Something broke ! <br />" + ((err.message) ? err.message : err));
			});

		// main page

		_app.get("/", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "index.html"));
		}).get("/public/app.js", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "app.js"));
		})

		// pictures

		.get("/public/pictures/warcraft3.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3.png"));
		}).get("/public/pictures/warcraft3TFT.png", (req, res) => {
			res.sendFile(path.join(__dirname, "web", "pictures", "warcraft3TFT.png"));
		});

		// add API V1 routes

		APIV1Routes(_app).catch((err) => {
			console.log("Impossible to initiate the API (V1)");
			console.log(err);
		});

		_app.listen(_conf.get("port"));

	}).catch((err) => {
		console.log("Impossible to initiate the configuration");
		console.log(err);
	});
