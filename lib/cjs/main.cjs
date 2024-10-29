"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// natives
const node_path_1 = require("node:path");
const node_https_1 = require("node:https");
const node_http_1 = require("node:http");
// externals
const node_confmanager_1 = __importDefault(require("node-confmanager"));
const simplessl_1 = __importDefault(require("simplessl"));
// locals
const returncodes_1 = __importDefault(require("./returncodes"));
const generateServer_1 = __importDefault(require("./server/generateServer"));
const webRoutes_1 = __importDefault(require("./server/webRoutes"));
const soundsRoutes_1 = __importDefault(require("./server/soundsRoutes"));
const apiRoutes_1 = __importDefault(require("./api/apiRoutes"));
// consts
const CONF = new node_confmanager_1.default("test");
// module
// generate conf
Promise.resolve().then(() => {
    CONF.skeleton("port", "integer").document("port", "Port used by the server");
    CONF.skeleton("ssl", "boolean").document("ssl", "Is SSL activated ?");
    return CONF.load().then(() => {
        CONF.set("port", CONF.has("port") ? CONF.get("port") : 3000);
        CONF.set("ssl", CONF.has("ssl") ? CONF.get("ssl") : false);
    });
}).then(() => {
    return (0, generateServer_1.default)();
    // generate routes
}).then((APP) => {
    (0, webRoutes_1.default)(APP);
    (0, soundsRoutes_1.default)(APP);
    return (0, apiRoutes_1.default)(APP).then(() => {
        return APP;
    });
    // generate web server
}).then((APP) => {
    // catch error
    APP.use((err, req, res, next) => {
        console.log(err);
        if (res.headersSent) {
            return next(err);
        }
        else {
            res.status(returncodes_1.default.INTERNAL).send("An internal error occured");
        }
    });
    // generate server
    if (CONF.get("ssl")) {
        const ssl = new simplessl_1.default();
        return ssl.createCertificate((0, node_path_1.join)(__dirname, "server.key"), (0, node_path_1.join)(__dirname, "server.csr"), (0, node_path_1.join)(__dirname, "server.crt"), "medium").then((keys) => {
            return (0, node_https_1.createServer)({
                "key": keys.privateKey,
                "cert": keys.certificate
            }, APP);
        });
    }
    else {
        return Promise.resolve((0, node_http_1.createServer)(APP));
    }
    // run server
}).then((server) => {
    server.listen(CONF.get("port"), () => {
        console.info("started" + (CONF.get("ssl") ? " with SSL" : "") + " on port " + CONF.get("port"));
    });
}).catch((err) => {
    console.error("");
    console.error("Impossible to initiate the application");
    console.error(err);
    console.error("");
    process.exitCode = 1;
    process.exit(1);
});
