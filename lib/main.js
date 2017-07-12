
"use strict";

// deps
	
	const path = require("path");
	const express = require("express");

	const apiv1 = require(path.join(__dirname, "api", "v1.js"));

// private

	var app = express();

// module

	// main page

	app.get("/", function (req, res) {
		res.send("Hello World");
	});

	// add API V1 routes

	apiv1(app).then(() => {

	}).catch((err) => {
		
	});

	app.listen(3000);
