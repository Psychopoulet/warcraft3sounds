
"use strict";

// deps

	const path = require("path");
	const spawn = require("child_process").spawn;
	const http = require("http");
	const fs = require("fs");
	const assert = require("assert");

// consts

	const MAIN_FILE = path.join(__dirname, "..", "lib", "main.js");
	const MAX_TIMEOUT_REQUEST = 3 * 1000;

// module

describe("server", () => {

	let server = null;

	it("should run the server", () => {

		return new Promise((resolve, reject) => {

			let timeout = null;

			server = spawn("node", [ path.join(__dirname, "..", "lib", "main.js") ], { cwd: path.join(__dirname, "..") }).on("error", (err) => {

				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}

				reject(err);

			});

			timeout = setTimeout(resolve, 1000);

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

	it("should get the main page", () => {

		return new Promise((resolve, reject) => {

			http.get("http://localhost:3000", (res) => {

				assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
				assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
				assert.strictEqual("object", typeof res.headers, "The headers are not an object");
				assert.strictEqual("text/html; charset=UTF-8", res.headers["content-type"], "The content-type header are not html/utf8");

				res.setEncoding("utf8");

				let rawData = "";
				res.on("data", (chunk) => { rawData += chunk; });
				res.on("end", () => {

					assert.strictEqual("string", typeof rawData, "The the index page's content returned by the server is not a text");

					fs.readFile(path.join(__dirname, "..", "lib", "web", "index.html"), "utf8", (err, content) => {

						if (err) {
							reject(err);
						}
						else {
							assert.strictEqual(rawData.length, content.length, "The the index page's content's length returned by the server is not the same that the file content");
							resolve();
						}

					});

				});

			});

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

});
