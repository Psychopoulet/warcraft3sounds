
"use strict";

// deps

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");
	const fileupload = require("express-fileupload");

// module

module.exports = () => {

	return Promise.resolve(express()
		.use(cors())
		.use(helmet())
		.use(compression())
		.use(fileupload())
		.use((err, req, res, next) => {

			return res.headersSent ?
				next(err) :
				res.status(require(require("path").join(__dirname, "returncodes.json")).INTERNAL).send(
				"Ouups ! Something broke ! <br />" + (err.message ? err.message : err)
			);

		})
	);

};
