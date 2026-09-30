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
    import { pathHealth } from "./paths/health";

// types & interfaces

    // externals
    import type { Express } from "express";

// private

    // express-openapi-validator does not support "$ref" on a path item (used for aliases like "/"),
    // so inline those references before giving it the spec
    async function loadSpec (file: string): Promise<unknown> {

        const spec: unknown = JSON.parse(await readFile(file, "utf-8"));
        const paths: Record<string, unknown> = spec.paths ?? {};

        const resolve = (item: unknown, depth: number = 0): unknown => {

            if (!item || typeof item.$ref !== "string" || !item.$ref.startsWith("#/paths/") || 10 < depth) {
                return item;
            }

            const key: string = item.$ref.slice("#/paths/".length)
                .replace(/~1/g, "/")
                .replace(/~0/g, "~");

            const { $ref, ...rest } = item;

            return { ...resolve(paths[key], depth + 1), ...rest };

        };

        for (const p of Object.keys(paths)) {
            paths[p] = resolve(paths[p]);
        }

        return spec;

    }

// module

export default async function generateServer (): Promise<Express> {

    const app: Express = express();

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
        "apiSpec": await loadSpec(join(__dirname, "..", "..", "data", "Descriptor.json")),
        "validateRequests": {
            "allowUnknownQueryParameters": true // tracking params (fbclid, utm_*, ...)
        },
        "validateResponses": true // false by default
    }));

    return app;

}
