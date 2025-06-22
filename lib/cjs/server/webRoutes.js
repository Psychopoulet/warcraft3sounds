"use strict";
// deps
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = webRoutes;
// natives
const node_path_1 = require("node:path");
// module
function webRoutes(app) {
    // main page
    app.get(["/", "/public/index.html"], (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "index.html"));
    });
    // app
    app.get("/public/bundle.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "bundle.js"));
    }).get("/public/bundle.js.map", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "bundle.js.map"));
    });
    // pictures
    app.get("/public/pictures/warcraft3.png", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "pictures", "warcraft3.png"));
    }).get("/public/pictures/warcraft3TFT.png", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
    });
}
