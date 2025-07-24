"use strict";
// deps
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getfileStats;
// natives
const node_fs_1 = require("node:fs");
// module
function getfileStats(file) {
    return new Promise((resolve) => {
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
    });
}
