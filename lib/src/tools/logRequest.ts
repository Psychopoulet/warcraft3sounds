// types & interfaces

    // externals
    import type { Request } from "express";

    // locals
    import getRequestPath from "./getRequestPath";

// module

export default function logRequest (req: Request): void {

    console.log("");
    console.log((req.ips.length ? req.ips : req.ip), "=>", getRequestPath(req));

    if (req.query && Object.keys(req.query).length) {
        console.log("query", req.query);
    }

    if (req.params && Object.keys(req.params).length) {
        console.log("params", req.params);
    }

    if (req.body) {
        console.log("body", req.body);
    }

    if (req.cookies && Object.keys(req.cookies).length) {
        console.log("cookies", req.cookies);
    }

}
