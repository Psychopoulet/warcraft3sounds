"use strict";

// deps

	const padleft = require(require("path").join(__dirname, "padleft.js"));

// module

module.exports = () => {

	const date = new Date();

	return "[" +
		(
			padleft(date.getHours(), 2, "0") + ":" +
			padleft(date.getMinutes(), 2, "0") + ":" +
			padleft(date.getSeconds(), 2, "0")
		) +
	"]";

};
