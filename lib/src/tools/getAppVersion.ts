// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

// types & interfaces

    // locals
    interface iPackageJson {
        "version": string;
    }

// private

    let _version: string | null = null;

// module

export default function getAppVersion (): Promise<string> {

    if ("string" === typeof _version) {
        return Promise.resolve(_version);
    }

    return readFile(join(__dirname, "..", "..", "..", "package.json"), "utf-8").then((content: string): iPackageJson => {
        return JSON.parse(content) as iPackageJson;
    }).then((packageData: iPackageJson): string => {
        _version = packageData.version;
        return _version;
    });

}
