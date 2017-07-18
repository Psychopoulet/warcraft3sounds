
"use strict";

// deps
	
	const path = require("path");
	const express = require("express");
	const helmet = require("helmet");
	const conf = require("node-confmanager");

	const APIV1Routes = require(path.join(__dirname, "api", "v1", "routes.js"));

// private

	var _app = express();
	var _conf = new conf(path.join(__dirname, "conf.json"));

// module

	_conf.load().then(() => {

		_app.use(helmet());

		// main page

		_app.get("/", function (req, res) {
			res.sendFile(path.join(__dirname, "web", "index.html"));
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
