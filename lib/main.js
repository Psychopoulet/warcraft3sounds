
"use strict";

// deps
	
	const path = require("path");
	const express = require("express");

	const APIV1Routes = require(path.join(__dirname, "api", "v1", "routes.js"));

// private

	var app = express();

// module

	// main page

	app.get("/", function (req, res) {
		res.send("Hello World");
	});

	// add API V1 routes

	APIV1Routes(app).catch((err) => {
		console.log("Impossible to initiate the API (V1)");
		console.log(err);
	});

	app.listen(3000);
