// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

// types & interfaces

    // locals
    interface iPackageJson {
        "homepage": string;
    }

// private

    let _github: string | null = null;

// module

export default function getAppGithub (): Promise<string> {

    if ("string" === typeof _github) {
        return Promise.resolve(_github);
    }

    return readFile(join(__dirname, "..", "..", "..", "package.json"), "utf-8").then((content: string): iPackageJson => {
        return JSON.parse(content) as iPackageJson;
    }).then((packageData: iPackageJson): string => {
        _github = packageData.homepage;
        return _github;
    });

}
