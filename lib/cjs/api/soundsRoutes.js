"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = soundsRoutes;
// natives
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
// locals
const returncodes_1 = __importDefault(require("../returncodes"));
// module
function soundsRoutes(app) {
    app.get("/public/sounds/:sound", (req, res, next) => {
        const sound = req.params.sound;
        const normalizedPath = (0, node_path_1.normalize)(sound);
        if (!normalizedPath.startsWith("/public")) {
            throw new Error("Illegal path supplied in the input url: " + req.baseUrl);
        }
        const file = (0, node_path_1.join)(__dirname, "..", "..", "..", "public", "sounds", sound);
        new Promise((resolve) => {
            (0, node_fs_1.stat)(file, (err, stats) => {
                if (err) {
                    return resolve({
                        "exists": false,
                        "size": 0
                    });
                }
                return resolve({
                    "exists": !(err || !stats.isFile()),
                    "size": stats.size
                });
            });
        }).then((stats) => {
            if (stats.exists) {
                res.status(returncodes_1.default.OK).set({
                    "Content-Type": ".wav" === (0, node_path_1.extname)(file) ? "audio/wav" : "audio/mpeg",
                    "Content-Length": stats.size
                });
                (0, node_fs_1.createReadStream)(file).pipe(res);
            }
            else {
                res.status(returncodes_1.default.NOTFOUND).json({
                    "code": String(returncodes_1.default.NOTFOUND),
                    "message": "Impossible to find the \"" + sound + "\" sound"
                });
            }
        }).catch(next);
    });
}
