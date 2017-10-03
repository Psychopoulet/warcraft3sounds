
"use strict";

// deps

	const { join } = require("path");
	const http = require("http");
	const fs = require("fs");
	const assert = require("assert");

	const generateServer = require(join(__dirname, "..", "lib", "server", "generateServer.js"));
	const webRoutes = require(join(__dirname, "..", "lib", "server", "webRoutes.js"));
	const soundsRoutes = require(join(__dirname, "..", "lib", "server", "soundsRoutes.js"));

// consts

	const MAX_TIMEOUT_REQUEST = 3000;

	const PORT = "3000";
	const MAIN_URL = "http://127.0.0.1:" + PORT + "/";

// module

describe("server (address 127.0.0.1 on port " + PORT + ")", () => {

	let server = null;

	beforeEach(() => {

		return generateServer().then((APP) => {

			return webRoutes(APP).then(() => {
				return Promise.resolve(APP);
			});

		}).then((APP) => {

			return soundsRoutes(APP).then(() => {
				return Promise.resolve(APP);
			});

		}).then((APP) => {

			return new Promise((resolve) => {

				server = APP.listen(PORT, () => {
					resolve(APP);
				});

			});

		});

	});

	afterEach(() => {

		return new Promise((resolve) => {

			server.close(() => {
				server = null;
				resolve();
			});

		});

	});

	describe("routes", () => {

		it("should get the main page (" + MAIN_URL + ")", () => {

			return new Promise((resolve) => {

				http.get(MAIN_URL, (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"text/html; charset=utf-8",
						res.headers["content-type"].toLowerCase(),
						"The content-type header are not html/utf8"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						assert.strictEqual("string", typeof rawData, "The returned content is not a text");

						fs.readFile(join(__dirname, "..", "lib", "public", "index.html"), "utf8", (err, content) => {

							assert.strictEqual(null, err, "The returned content generate an error");
							assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

		it("should get the js app (" + MAIN_URL + "public/app.js)", () => {

			return new Promise((resolve) => {

				http.get(MAIN_URL + "public/app.js", (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"application/javascript",
						res.headers["content-type"].toLowerCase(),
						"The content-type header are not js"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						assert.strictEqual("string", typeof rawData, "The returned content is not a text");

						fs.readFile(join(__dirname, "..", "lib", "public", "app.js"), "utf8", (err, content) => {

							assert.strictEqual(null, err, "The returned content generate an error");
							assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

		it("should get the warcraft3 picture (" + MAIN_URL + "public/pictures/warcraft3.png)", () => {

			return new Promise((resolve) => {

				http.get(MAIN_URL + "public/pictures/warcraft3.png", (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"image/png",
						res.headers["content-type"].toLowerCase(),
						"The content-type header is not png"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						assert.strictEqual("string", typeof rawData, "The returned content is not a text");

						fs.readFile(join(__dirname, "..", "lib", "public", "pictures", "warcraft3.png"), "utf8", (err, content) => {

							assert.strictEqual(null, err, "The returned content generate an error");
							assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

		it("should get the TFT picture (" + MAIN_URL + "public/pictures/warcraft3TFT.png)", () => {

			return new Promise((resolve) => {

				http.get(MAIN_URL + "public/pictures/warcraft3TFT.png", (res) => {

					assert.strictEqual(200, res.statusCode, "The statusCode is not 200");
					assert.strictEqual("OK", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"image/png",
						res.headers["content-type"].toLowerCase(),
						"The content-type header is not png"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						assert.strictEqual("string", typeof rawData, "The returned content is not a text");

						fs.readFile(join(__dirname, "..", "lib", "public", "pictures", "warcraft3TFT.png"), "utf8", (err, content) => {

							assert.strictEqual(null, err, "The returned content generate an error");
							assert.strictEqual(rawData.length, content.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

		it("should get the an inexistant sound (" + MAIN_URL + "public/pictures/test.wav)", () => {

			return new Promise((resolve) => {

				http.get(MAIN_URL + "public/sounds/test.wav", (res) => {

					assert.strictEqual(404, res.statusCode, "The statusCode is not 404");
					assert.strictEqual("Not Found", res.statusMessage, "The statusMessage is not valid");
					assert.strictEqual("object", typeof res.headers, "The headers are not an object");
					assert.strictEqual(
						"text/html; charset=utf-8",
						res.headers["content-type"].toLowerCase(),
						"The content-type header is not wav"
					);

					res.setEncoding("utf8");

					resolve();

				});

			});

		}).timeout(MAX_TIMEOUT_REQUEST);

	});

});
