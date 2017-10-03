
"use strict";

// deps

	const checksum = require("checksum");

// module

module.exports = (file) => {

	return new Promise((resolve, reject) => {

		if ("undefined" === typeof file) {
			reject(new ReferenceError("missing \"file\" argument"));
		}
			else if ("string" !== typeof file) {
				reject(new TypeError("\"file\" argument is not a string"));
			}
			else if ("" === file.trim()) {
				reject(new Error("\"file\" argument is empty"));
			}
		else {

			process.nextTick(() => {

				checksum.file(file, {
					"algorithm": "sha256"
				}, (err, sum) => {
					return err ? reject(err) : resolve(sum);
				});

			});

		}

	});

};
