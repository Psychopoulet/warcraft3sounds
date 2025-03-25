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
    }).get("/public/app.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "app.js"));
    });
    // app
    app.get("/public/bundle.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "bundle.js"));
    }).get("/public/bundle.js.map", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "bundle.js.map"));
    });
    // libs
    app.get("/public/jquery.min.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "jquery-3.2.1.min.js"));
    }).get("/public/popper.min.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "popper-1.11.0.min.js"));
    }).get("/public/bootstrap.min.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "bootstrap-4.0.0-beta.min.js"));
    }).get("/public/angular.min.js", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "angular-1.6.5.min.js"));
    });
    // pictures
    app.get("/public/pictures/warcraft3.png", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "pictures", "warcraft3.png"));
    }).get("/public/pictures/warcraft3TFT.png", (req, res) => {
        return res.sendFile((0, node_path_1.join)(__dirname, "..", "..", "..", "public", "pictures", "warcraft3TFT.png"));
    });
}
