"use strict";
// deps
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathPublicIndex = pathPublicIndex;
exports.pathPublicApp = pathPublicApp;
exports.pathPublicAppMap = pathPublicAppMap;
exports.pathPublicIconW3 = pathPublicIconW3;
exports.pathPublicIconTFT = pathPublicIconTFT;
// natives
const node_path_1 = require("node:path");
// module
// main page
function pathPublicIndex(req, res) {
    return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "index.html"));
}
// app
function pathPublicApp(req, res) {
    return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "bundle.js"));
}
function pathPublicAppMap(req, res) {
    return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "bundle.js.map"));
}
// pictures
function pathPublicIconW3(req, res) {
    return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3.png"));
}
function pathPublicIconTFT(req, res) {
    return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
}
