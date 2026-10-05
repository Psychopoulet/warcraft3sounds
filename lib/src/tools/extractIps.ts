// deps

    // natives
    import { isIP } from "node:net";

// types & interfaces

    // externals
    import type { Request } from "express";

// consts

    // "X-Forwarded-For" is client-controlled : a request cannot make us record more IPs than that
    const MAX_IPS: number = 5;

// module

export default function extractIps (req: Request): string[] {

    const ips: string[] = [];

    // "trust proxy" makes these values come from "X-Forwarded-For" : keep only real IP addresses
    const candidates: string[] = Array.isArray(req.ips) ? [ ...req.ips ] : [];

    if ("string" === typeof req.ip) {
        candidates.push(req.ip);
    }

    for (const candidate of candidates) {

        if (MAX_IPS <= ips.length) {
            break;
        }

        if (0 !== isIP(candidate) && !ips.includes(candidate)) {
            ips.push(candidate);
        }

    }

    return ips;

}
