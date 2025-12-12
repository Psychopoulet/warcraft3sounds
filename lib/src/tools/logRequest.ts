// types & interfaces

    // externals
    import type { Request } from "express";

    // locals
    import getRequestPath from "./getRequestPath";

// module

export default function logRequest (req: Request): void {

    console.log("");
    console.log((req.ips.length ? req.ips : req.ip), "=>", getRequestPath(req));

    if ("object" === typeof req.query && Object.keys(req.query).length) {
        console.log("query", req.query);
    }

    if ("object" === typeof req.params && Object.keys(req.params).length) {
        console.log("params", req.params);
    }

    if ("undefined" !== typeof req.body) {
        console.log("body", req.body);
    }

    if ("undefined" !== typeof req.cookies) {
        console.log("cookies", req.cookies);
    }

}
