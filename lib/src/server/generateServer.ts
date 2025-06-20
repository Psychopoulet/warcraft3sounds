// deps

    // externals
    import express from "express";
    import cors from "cors";
    import helmet from "helmet";
    import compression from "compression";

// types & interfaces

    // externals
    import type { Express } from "express";

// module

export default function generateServer (): Express {

    return express()
        .use(cors())
        .use(helmet({
            "contentSecurityPolicy": false
        }))
        .use(compression());

}
