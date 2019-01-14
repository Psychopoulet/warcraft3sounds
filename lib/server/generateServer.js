
"use strict";

// deps

	const express = require("express");
	const cors = require("cors");
	const helmet = require("helmet");
	const compression = require("compression");

// module

module.exports = () => {

	return Promise.resolve(express()
		.use(cors())
		.use(helmet())
		.use(compression())
	);

};
