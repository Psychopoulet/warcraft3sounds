// deps

    // natives
    import { isIP } from "node:net";

// types & interfaces

    // externals
    import type { Request } from "express";

// consts

    // "X-Forwarded-For" is client-controlled : a request cannot make us record more IPs than that
    const MAX_IPS: number = 5;

// private

    // "::ffff:1.2.3.4" (IPv4-mapped IPv6) and "1.2.3.4" are the same client
    function _normalize (ip: string): string {

        const unmapped: string = ip.replace(/^::ffff:/iu, "");

        return 4 === isIP(unmapped) ? unmapped : ip;

    }

// module

export default function extractIps (req: Request): string[] {

    // "trust proxy" makes these values come from "X-Forwarded-For" : keep only real IP addresses
    const candidates: string[] = Array.isArray(req.ips) ? [ ...req.ips ] : [];

    if ("string" === typeof req.ip) {
        candidates.push(req.ip);
    }

    return candidates
        .map(_normalize)
        .filter((ip: string, index: number, all: string[]): boolean => {
            return 0 !== isIP(ip) && index === all.indexOf(ip);
        })
        .slice(0, MAX_IPS);

}
