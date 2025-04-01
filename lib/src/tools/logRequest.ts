// types & interfaces

	// externals
	import type { Request } from "express";

export default function logRequest (req: Request): void {

    console.log("");
    console.log((req.ips.length ? req.ips : req.ip), "=>", "[" + req.method + "]" + req.protocol + "://" + req.hostname + (req.path.length ? req.path : ""));

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
