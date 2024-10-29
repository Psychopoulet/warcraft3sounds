"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateServer;
// externals
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
// module
function generateServer() {
    return (0, express_1.default)()
        .use((0, cors_1.default)())
        .use((0, helmet_1.default)())
        .use((0, compression_1.default)());
}
