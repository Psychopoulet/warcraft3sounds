"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathErrorTest = pathErrorTest;
exports.pathErrorGlobal = pathErrorGlobal;
// externals
const express_openapi_validator_1 = require("express-openapi-validator");
// locals
const returncodes_1 = __importDefault(require("../../returncodes"));
const logRequest_1 = __importDefault(require("../../tools/logRequest"));
// module
function pathErrorTest(req, res, next) {
    next(new Error("This is a test error"));
}
function pathErrorGlobal(err, req, res, next) {
    (0, logRequest_1.default)(req);
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    else if (err instanceof express_openapi_validator_1.error.NotFound) { // specific to express-openapi-validator
        res.status(returncodes_1.default.NOTFOUND).json({
            "code": returncodes_1.default.NOTFOUND,
            "message": "\"" + err.path + "\" not found"
        });
    }
    else {
        res.status(returncodes_1.default.INTERNAL).json({
            "code": returncodes_1.default.INTERNAL,
            "message": err.message
        });
    }
}
