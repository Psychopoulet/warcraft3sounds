"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathErrorTest = pathErrorTest;
exports.pathErrorNotFound = pathErrorNotFound;
exports.pathErrorGlobal = pathErrorGlobal;
// locals
const returncodes_1 = __importDefault(require("../../returncodes"));
const logRequest_1 = __importDefault(require("../../tools/logRequest"));
const getRequestPath_1 = __importDefault(require("../../tools/getRequestPath"));
// module
function pathErrorTest(req, res, next) {
    next(new Error("This is a test error"));
}
function pathErrorNotFound(req, res, next) {
    (0, logRequest_1.default)(req);
    console.error("Not found");
    if (res.headersSent) {
        return next("Not found");
    }
    else {
        res.status(returncodes_1.default.NOTFOUND).json({
            "code": returncodes_1.default.NOTFOUND,
            "message": (0, getRequestPath_1.default)(req) + " not found"
        });
    }
}
function pathErrorGlobal(err, req, res, next) {
    (0, logRequest_1.default)(req);
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    else {
        res.status(returncodes_1.default.INTERNAL).json({
            "code": returncodes_1.default.INTERNAL,
            "message": err.message
        });
    }
}
