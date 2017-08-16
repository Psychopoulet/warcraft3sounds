
"use strict";

// deps

	const crypto = require("crypto");
	const { createReadStream } = require("fs");

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

				const hash = crypto.createHash("sha1");

				createReadStream(file)
					.on("error", reject)
					.on("data", (chunk) => {
						hash.update(chunk);
					})
					.on("end", () => {
						resolve(hash.digest("hex"));
					});

			});

		}

	});

};
