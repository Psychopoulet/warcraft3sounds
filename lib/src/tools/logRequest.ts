// deps

    // locals
    import getLogger from "./getLogger";
    import getRequestPath from "./getRequestPath";

// types & interfaces

    // externals
    import type { Request } from "express";

// module

    function _part (label: string, value: unknown): string {

        return label + " " + JSON.stringify(value);

    }

    function _message (req: Request): string {

        const parts: string[] = [ String(req.ips.length ? req.ips.join(", ") : req.ip) + " => " + getRequestPath(req) ];

        if ("object" === typeof req.query && Object.keys(req.query).length) {
            parts.push(_part("query", req.query));
        }

        if ("object" === typeof req.params && Object.keys(req.params).length) {
            parts.push(_part("params", req.params));
        }

        if ("undefined" !== typeof req.body) {
            parts.push(_part("body", req.body));
        }

        if ("undefined" !== typeof req.cookies) {
            parts.push(_part("cookies", req.cookies));
        }

        return parts.join(" ");

    }

export default function logRequest (req: Request): void {

    getLogger().info(_message(req));

}
