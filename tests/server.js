
"use strict";

// deps

	const path = require("path");
	const spawn = require("child_process").spawn;
	const http = require("http");
	const fs = require("fs");
	const assert = require("assert");

// consts

	const MAIN_FILE = path.join(__dirname, "..", "lib", "main.js");
	const MAX_TIMEOUT_REQUEST = 3000;

	const PORT = "3000";
	const MAIN_URL = "http://127.0.0.1:" + PORT + "/";
	const API_URL = MAIN_URL + "api/v1/";

// module

describe("server (address 127.0.0.1 on port " + PORT + ")", () => {

	let child = null;

	after(() => {

		return Promise.resolve().then(() => {

			if (child) {
				child.stdin.pause();
				child.kill();
			}

			return Promise.resolve();

		});

	});

	it("should run the server", () => {

		return new Promise((resolve) => {

			child = spawn(
				"node",
				[ path.join(__dirname, "..", "lib", "main.js"), "--port", PORT ],
				{ cwd: path.join(__dirname, "..") }
			);

			resolve();

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

	it("should get the main page (" + MAIN_URL + ")", () => {

		return new Promise((resolve) => {

			http.get(MAIN_URL, (res) => {

				assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
				assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
				assert.strictEqual("object", typeof res.headers, "The headers are not an object");
				assert.strictEqual("text/html; charset=utf-8", res.headers["content-type"].toLowerCase(), "The content-type header are not html/utf8");

				res.setEncoding("utf8");

				let rawData = "";
				res.on("data", (chunk) => { rawData += chunk; });
				res.on("end", () => {

					assert.strictEqual("string", typeof rawData, "The returned content is not a text");

					fs.readFile(path.join(__dirname, "..", "lib", "web", "index.html"), "utf8", (err, content) => {

						assert.strictEqual(null, err, "The returned content's generate an error");
						assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

						resolve();

					});

				});

			});

		});

	}).timeout(MAX_TIMEOUT_REQUEST);

	describe("API V1", () => {

		it("should get the IPs recovery (" + API_URL + "ips)", () => {

			return new Promise((resolve) => {

				http.get(API_URL + "ips", (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual("application/json; charset=utf-8", res.headers["content-type"].toLowerCase(), "The content-type header are not html/utf8");

					res.setEncoding("utf8");

					let rawData = "";
					res.on("data", (chunk) => { rawData += chunk; });
					res.on("end", () => {

						assert.strictEqual("string", typeof rawData, "The the returned content is not a string");

						assert.doesNotThrow(() => {
							JSON.parse(rawData);
						}, "The the returned content is not a JSON");

						resolve();

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

	});

});
