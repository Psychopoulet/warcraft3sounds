// deps

    // natives
    import { join } from "node:path";

    // externals
    import express from "express";
    import cors from "cors";
    import helmet from "helmet";
    import compression from "compression";
    import { middleware } from "express-openapi-validator";

// types & interfaces

    // externals
    import type { Express } from "express";

// module

export default function generateServer (): Express {

    return express()
        .use(cors())
        .use(helmet({
            "contentSecurityPolicy": false,
            "crossOriginResourcePolicy": false
        }))
        .use(middleware({
            "apiSpec": join(__dirname, "..", "..", "data", "descriptor.json"),
            "validateRequests": true, // (default)
            "validateResponses": true // false by default
        }))
        .use(compression());

}
