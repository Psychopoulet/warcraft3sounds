"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirect = redirect;
// locals
const returncodes_1 = __importDefault(require("../../returncodes"));
const logRequest_1 = __importDefault(require("../../tools/logRequest"));
// module
function redirect(path) {
    return function pathRedirection(req, res) {
        (0, logRequest_1.default)(req);
        console.error("Redirected to", path);
        res.set("location", path);
        res.status(returncodes_1.default.REDIRECT).send("Redirected to \"" + path + "\"");
    };
}
