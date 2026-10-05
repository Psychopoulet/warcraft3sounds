// types & interfaces

    // externals
    import type { Request } from "express";

// module

export default function extractIps (req: Request): string[] {

    const ips: string[] = [];

    if (Array.isArray(req.ips) && 0 < req.ips.length) {
        ips.push(...req.ips);
    }

    if ("string" === typeof req.ip && "" !== req.ip && !ips.includes(req.ip)) {
        ips.push(req.ip);
    }

    return ips;

}
