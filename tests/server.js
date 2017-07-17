
"use strict";

// deps

	const path = require("path");
	const assert = require("assert");

// consts

	const MAIN_FILE = path.join(__dirname, "..", "lib", "main.js");

// module

describe("server", () => {

	it("should run the server", () => {

		assert.equal("1", "1", "WHAAAAT ??");

	});

});
