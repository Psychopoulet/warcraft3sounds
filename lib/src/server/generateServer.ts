/* eslint-disable @typescript-eslint/no-unused-vars */
// @typescript-eslint/no-unused-vars : let us remove a data with spread operator

// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // externals
    import express from "express";
    import cors from "cors";
    import helmet from "helmet";
    import compression from "compression";
    import { middleware } from "express-openapi-validator";

    // locals
    import pathHealth from "./paths/health";

// types & interfaces

    // externals
    import type { Express } from "express";

    // express-openapi-validator does not export its spec types: derive them from the middleware signature
    type ApiSpec = Exclude<Parameters<typeof middleware>[0]["apiSpec"], string>;
    type ApiPaths = NonNullable<ApiSpec["paths"]>;
    type ApiPathItem = ApiPaths[string];

// private

    function _resolve (paths: ApiPaths, item: ApiPathItem, depth: number = 0): ApiPathItem {

        if ("string" !== typeof item.$ref || !item.$ref.startsWith("#/paths/") || 10 < depth) {
            return item;
        }

        const target: ApiPathItem | undefined = paths[
            item.$ref.slice("#/paths/".length).replace(/~1/g, "/").replace(/~0/g, "~")
        ];

        if ("undefined" === typeof target) {
            return item;
        }

        const { $ref, ...rest } = item;

        return { ..._resolve(paths, target, depth + 1), ...rest };

    }

    // express-openapi-validator does not support "$ref" on a path item (used for aliases like "/"),
    // so inline those references before giving it the spec
    async function _loadSpec (file: string): Promise<ApiSpec> {

        const spec: ApiSpec = JSON.parse(await readFile(file, "utf-8")) as ApiSpec;
        const paths: ApiPaths = spec.paths ?? {};

        const resolved: Record<string, ApiPathItem> = {};

        for (const [ path, item ] of Object.entries(paths)) {
            resolved[path] = _resolve(paths, item);
        }

        return { ...spec, "paths": resolved };

    }

// module

export default async function generateServer (): Promise<Express> {

    const app: Express = express();

    // trust reverse proxy (nginx, traefik...) for X-Forwarded-For
    app.set("trust proxy", true);

    app
        .use(express.json())
        .use(cors())
        .use(helmet({
            "contentSecurityPolicy": false,
            "crossOriginResourcePolicy": false
        }))
        .use(compression());

    // before OpenAPI: deploy / Docker HEALTHCHECK must not depend on the Swagger spec
    app.get("/health", pathHealth);

    // check OpenAPI spec
    app.use(middleware({
        "apiSpec": await _loadSpec(join(__dirname, "..", "..", "data", "Descriptor.json")),
        "validateRequests": {
            "allowUnknownQueryParameters": true // tracking params (fbclid, utm_*, ...)
        },
        "validateResponses": true // false by default
    }));

    return app;

}
