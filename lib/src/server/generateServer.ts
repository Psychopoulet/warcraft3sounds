// deps

    // natives
    import { join } from "node:path";

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

// module

export default function generateServer (): Express {

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
        "apiSpec": join(__dirname, "..", "..", "data", "descriptor.json"),
        "validateRequests": true, // (default)
        "validateResponses": true // false by default
    }));

    return app;

}
