// deps

    // native
    const { strictEqual } = require("node:assert");

    // externals
    const checksum = require("checksum");

// module

describe("API / checksum", () => {

    it("should check checksum", () => {

        return Promise.resolve().then(() => {

            return Promise.resolve(checksum("test", {
                "algorithm": "sha256"
            }));

        }).then((sum) => {

            strictEqual(typeof sum, "string", "Check \"test\" parameter does not generate a valid checksum");
            strictEqual(
                sum,
                "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                "Check \"test\" valid file parameter does not generate a valid checksum"
            );

            return Promise.resolve();

        });

    });

});
