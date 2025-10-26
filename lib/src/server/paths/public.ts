// deps

    // natives
    import { join } from "node:path";

// types & interfaces

    // externals
    import type { Request, Response } from "express";

// module

    // main page

    export function pathPublicIndex (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "index.html"));
    }

    // app

    export function pathPublicApp (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "bundle.js"));
    }

    export function pathPublicAppMap (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "bundle.js.map"));
    }

    // pictures

    export function pathPublicIconW3 (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3.png"));
    }

    export function pathPublicIconTFT (req: Request, res: Response): void {
        return res.sendFile(join(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
    }
