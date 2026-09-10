// deps

    // natives
    const { join } = require("node:path");
    const { readFile, lstat } = require("node:fs/promises");
    const { equal } = require("node:assert");

// consts

    const DESCRIPTOR_FILE = join(__dirname, "..", "lib", "data", "Descriptor.json");
    const PACKAGE_FILE = join(__dirname, "..", "package.json");

// tests

describe("check descriptor", () => {

    it("should check files existence", async () => {

        const descriptorStats = await lstat(DESCRIPTOR_FILE);
        const packageStats = await lstat(PACKAGE_FILE);

        equal(packageStats.isFile(), true, "Package file does not exist");
        equal(descriptorStats.isFile(), true, "Descriptor file does not exist");

    });

    it("should match with package.json", async () => {

        const packageFile = JSON.parse(await readFile(PACKAGE_FILE, "utf-8"));
        const descriptor = JSON.parse(await readFile(DESCRIPTOR_FILE, "utf-8"));

        equal(descriptor.info.version, packageFile.version, "Descriptor version does not match with package.json version");
        equal(descriptor.info.title, packageFile.name, "Descriptor title does not match with package.json name");
        equal(descriptor.info.description, packageFile.description, "Descriptor title does not match with package.json name");

    });

});
