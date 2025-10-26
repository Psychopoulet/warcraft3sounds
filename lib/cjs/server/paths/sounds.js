"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathSounds = pathSounds;
// natives
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
// locals
const returncodes_1 = __importDefault(require("../../returncodes"));
const getFileStats_1 = __importDefault(require("../../tools/getFileStats"));
// module
function pathSounds(req, res, next) {
    const sound = req.params.sound;
    const file = (0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "sounds", sound);
    (0, getFileStats_1.default)(file).then((stats) => {
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
}
