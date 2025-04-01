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
    app.get("/public/sounds/:sound", (req, res) => {
        const file = (0, node_path_1.join)(__dirname, "..", "..", "..", "public", "sounds", req.params.sound);
        new Promise((resolve) => {
            (0, node_fs_1.stat)(file, (err, stats) => {
                return resolve(!(err || !stats.isFile()));
            });
        }).then((exists) => {
            if (exists) {
                res.status(returncodes_1.default.OK).set({
                    "Content-Type": ".wav" === (0, node_path_1.extname)(file) ? "audio/wav" : "audio/mpeg"
                });
                (0, node_fs_1.createReadStream)(file).pipe(res);
            }
            else {
                console.warn("Cannot find", file);
                res.status(returncodes_1.default.NOTFOUND).send("Impossible to find \"" + req.params.sound + "\"");
            }
        }).catch((err) => {
            console.error(err);
            res.status(returncodes_1.default.INTERNAL).send("An internal error occured");
        });
    });
}
