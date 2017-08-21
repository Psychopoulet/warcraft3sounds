
"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");
	const checksum = require(join(__dirname, "..", "lib", "checksum.js"));

// module

describe("chechsum", () => {

	it("should check missing file parameter", (done) => {

		checksum().then(() => {
			done(new Error("Check missing file parameter does not generate any error"));
		}).catch((err) => {

			assert.deepStrictEqual("object", typeof err, "Check missing file parameter does not generate a valid error");
			assert.deepStrictEqual(true, err instanceof Error, "Check missing file parameter does not generate a valid error");

			done();

		});

	});

	it("should check wrong file parameter", (done) => {

		checksum(false).then(() => {
			done(new Error("Check wrong file parameter does not generate any error"));
		}).catch((err) => {

			assert.deepStrictEqual("object", typeof err, "Check wrong file parameter does not generate a valid error");
			assert.deepStrictEqual(true, err instanceof Error, "Check wrong file parameter does not generate a valid error");

			done();

		});

	});

	it("should check empty file parameter", (done) => {

		checksum("").then(() => {
			done(new Error("Check empty file parameter does not generate any error"));
		}).catch((err) => {

			assert.deepStrictEqual("object", typeof err, "Check empty file parameter does not generate a valid error");
			assert.deepStrictEqual(true, err instanceof Error, "Check empty file parameter does not generate a valid error");

			done();

		});

	});

	it("should check valid file parameter", () => {

		const fileCheckSum = join(__dirname, "..", "lib", "checksum.js");

		return checksum(fileCheckSum).then((data) => {

			assert.deepStrictEqual("string", typeof data, "Check \"" + fileCheckSum + "\" file parameter does not generate a valid checksum");
			assert.deepStrictEqual(
				"19ab4f7ec8c5934c0657200696804e03189f5549",
				data,
				"Check \"" + fileCheckSum + "\" valid file parameter does not generate a valid checksum"
			);

			return Promise.resolve();

		});

	});

});
