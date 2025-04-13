"use strict";
// types & interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logRequest;
function logRequest(req) {
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
