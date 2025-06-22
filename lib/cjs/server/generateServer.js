"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateServer;
// natives
const node_path_1 = require("node:path");
// externals
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_openapi_validator_1 = require("express-openapi-validator");
// module
function generateServer() {
    return (0, express_1.default)()
        .use((0, cors_1.default)())
        .use((0, helmet_1.default)({
        "contentSecurityPolicy": false
    }))
        .use((0, express_openapi_validator_1.middleware)({
        "apiSpec": (0, node_path_1.join)(__dirname, "..", "..", "data", "descriptor.json"),
        "validateRequests": true, // (default)
        "validateResponses": true // false by default
    }))
        .use((0, compression_1.default)());
}
