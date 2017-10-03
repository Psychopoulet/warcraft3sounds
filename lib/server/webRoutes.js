
"use strict";

// deps

	const { join } = require("path");

// module

module.exports = (app) => {

	return Promise.resolve().then(() => {

		// main page

		app.get("/", (req, res) => {
			res.sendFile(join(__dirname, "..", "public", "index.html"));
		})
		.get("/public/app.js", (req, res) => {
			res.sendFile(join(__dirname, "..", "public", "app.js"));
		})

		// pictures

		.get("/public/pictures/warcraft3.png", (req, res) => {
			res.sendFile(join(__dirname, "..", "public", "pictures", "warcraft3.png"));
		})
		.get("/public/pictures/warcraft3TFT.png", (req, res) => {
			res.sendFile(join(__dirname, "..", "public", "pictures", "warcraft3TFT.png"));
		});

		return Promise.resolve();

	});

};
