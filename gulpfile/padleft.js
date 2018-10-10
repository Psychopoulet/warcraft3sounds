"use strict";

// module

module.exports = (msg, size, padder) => {

	const PADDER = "string" === typeof padder ? padder : " ";

	let result = "string" === typeof msg ? msg : String(msg);

		for (let i = result.length; i < size; ++i) {
			result = PADDER + result;
		}

	return result;

};
