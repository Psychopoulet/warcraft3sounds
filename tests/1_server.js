
"use strict";

// deps

	const { join } = require("path");
	const { get } = require("http");
	const { readFile } = require("fs");
	const { strictEqual } = require("assert");

	const generateServer = require(join(__dirname, "..", "lib", "server", "generateServer.js"));
	const webRoutes = require(join(__dirname, "..", "lib", "server", "webRoutes.js"));
	const soundsRoutes = require(join(__dirname, "..", "lib", "server", "soundsRoutes.js"));

// consts

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

				get(MAIN_URL, (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"text/html; charset=utf-8",
						"The content-type header are not html/utf8"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The returned content is not a text");

						readFile(join(__dirname, "..", "lib", "public", "index.html"), "utf8", (err, content) => {

							strictEqual(err, null, "The returned content generate an error");
							strictEqual(content.length, rawData.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		});

		it("should get the js app (" + MAIN_URL + "public/app.js)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/app.js", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"application/javascript; charset=utf-8",
						"The content-type header are not js"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The returned content is not a text");

						readFile(join(__dirname, "..", "lib", "public", "app.js"), "utf8", (err, content) => {

							strictEqual(err, null, "The returned content generate an error");
							strictEqual(content.length, rawData.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		});

		it("should get the warcraft3 picture (" + MAIN_URL + "public/pictures/warcraft3.png)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/pictures/warcraft3.png", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"image/png",
						"The content-type header is not png"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The returned content is not a text");

						readFile(join(__dirname, "..", "lib", "public", "pictures", "warcraft3.png"), "utf8", (err, content) => {

							strictEqual(err, null, "The returned content generate an error");
							strictEqual(content.length, rawData.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		});

		it("should get the TFT picture (" + MAIN_URL + "public/pictures/warcraft3TFT.png)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/pictures/warcraft3TFT.png", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"image/png",
						"The content-type header is not png"
					);

					res.setEncoding("utf8");

					let rawData = "";

					res.on("data", (chunk) => {
						rawData += chunk;
					}).on("end", () => {

						strictEqual(typeof rawData, "string", "The returned content is not a text");

						readFile(join(__dirname, "..", "lib", "public", "pictures", "warcraft3TFT.png"), "utf8", (err, content) => {

							strictEqual(err, null, "The returned content generate an error");
							strictEqual(content.length, rawData.length, "The returned content's length is not the same that the file content");

							resolve();

						});

					});

				});

			});

		});

		it("should get the an inexistant sound (" + MAIN_URL + "public/pictures/test.wav)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/sounds/test.wav", (res) => {

					strictEqual(res.statusCode, 404, "The statusCode is not 404");
					strictEqual(res.statusMessage, "Not Found", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"text/html; charset=utf-8",
						"The content-type header is not html"
					);

					res.setEncoding("utf8");

					resolve();

				});

			});

		});

		it("should get the an existant wav sound (" + MAIN_URL + "public/pictures/testsound.wav)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/sounds/testsound.wav", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"audio/wav",
						"The content-type header is not mpeg"
					);

					res.setEncoding("utf8");

					resolve();

				});

			});

		});

		it("should get the an existant mp3 sound (" + MAIN_URL + "public/pictures/testsound.mp3)", () => {

			return new Promise((resolve) => {

				get(MAIN_URL + "public/sounds/testsound.mp3", (res) => {

					strictEqual(res.statusCode, 200, "The statusCode is not 200");
					strictEqual(res.statusMessage, "OK", "The statusMessage is not valid");
					strictEqual(typeof res.headers, "object", "The headers are not an object");
					strictEqual(
						res.headers["content-type"].toLowerCase(),
						"audio/mpeg",
						"The content-type header is not mpeg"
					);

					res.setEncoding("utf8");

					resolve();

				});

			});

		});

	});

});
