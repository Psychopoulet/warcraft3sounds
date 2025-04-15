"use strict";
// types & interfaces
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logRequest;
// locals
const getRequestPath_1 = __importDefault(require("./getRequestPath"));
// module
function logRequest(req) {
    console.log("");
    console.log((req.ips.length ? req.ips : req.ip), "=>", (0, getRequestPath_1.default)(req));
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
