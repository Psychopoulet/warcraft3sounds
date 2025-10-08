"use strict";
// deps
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// natives
const node_https_1 = require("node:https");
const node_http_1 = require("node:http");
const node_crypto_1 = require("node:crypto");
// externals
const node_confmanager_1 = __importDefault(require("node-confmanager"));
const node_forge_1 = require("node-forge");
// locals
const logRequest_1 = __importDefault(require("./tools/logRequest"));
const getRequestPath_1 = __importDefault(require("./tools/getRequestPath"));
const returncodes_1 = __importDefault(require("./returncodes"));
const generateServer_1 = __importDefault(require("./server/generateServer"));
const webRoutes_1 = __importDefault(require("./server/webRoutes"));
const apiRoutes_1 = __importDefault(require("./api/apiRoutes"));
const soundsRoutes_1 = __importDefault(require("./api/soundsRoutes"));
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
    // catch "not found" request
    APP.use((req, res, next) => {
        (0, logRequest_1.default)(req);
        console.error("Not found");
        if (res.headersSent) {
            return next("Not found");
        }
        else {
            res.status(returncodes_1.default.NOTFOUND).json({
                "code": returncodes_1.default.NOTFOUND,
                "message": (0, getRequestPath_1.default)(req) + " not found"
            });
        }
    });
    // catch error
    APP.use((err, req, res, next) => {
        (0, logRequest_1.default)(req);
        console.error(err);
        if (res.headersSent) {
            return next(err);
        }
        else {
            res.status(returncodes_1.default.INTERNAL).json({
                "code": returncodes_1.default.INTERNAL,
                "message": err.message
            });
        }
    });
    // generate server
    if (CONF.get("ssl")) {
        // https://stackoverflow.com/questions/51955695/node-forge-self-signed-certificate-for-https-module
        return new Promise((resolve, reject) => {
            node_forge_1.pki.rsa.generateKeyPair({
                "bits": 4096,
                "workers": 2
            }, (err, keypair) => {
                return err ? reject(err) : resolve(keypair);
            });
        }).then((keypair) => {
            const cert = node_forge_1.pki.createCertificate();
            cert.publicKey = keypair.publicKey;
            cert.serialNumber = "01" + (0, node_crypto_1.randomBytes)(19).toString("hex"); // 1 octet = 8 bits = 1 byte = 2 hex chars (https://advancedweb.hu/how-to-generate-an-https-certificate-with-node-forge/)
            cert.validity.notBefore = new Date();
            cert.validity.notAfter = new Date();
            cert.validity.notAfter.setFullYear(new Date().getFullYear() + 1); // one year validity
            const SSL_OPTIONS = [
                {
                    "name": "commonName",
                    "value": "localhost"
                }, {
                    "name": "organizationName",
                    "value": "warcraft3sounds"
                }, {
                    "name": "countryName",
                    "value": "FR"
                }, {
                    "name": "stateOrProvinceName",
                    "value": "France"
                }, {
                    "name": "localityName",
                    "value": "Paris"
                }, {
                    "name": "emailAddress",
                    "value": "svida1@free.fr"
                }
            ];
            console.info("certificate options :", JSON.stringify(SSL_OPTIONS));
            const SSL_EXTENSIONS = [
                {
                    "name": "subjectAltName",
                    "altNames": [
                        {
                            "type": 2,
                            "value": "warcraft3sounds"
                        }, {
                            "type": 2,
                            "value": "localhost"
                        }, {
                            "type": 7,
                            "value": "127.0.0.1"
                        }
                    ]
                }
            ];
            cert.setSubject(SSL_OPTIONS);
            cert.setIssuer(SSL_OPTIONS);
            cert.setExtensions(SSL_EXTENSIONS);
            cert.sign(keypair.privateKey);
            const pemPrivateKey = node_forge_1.pki.privateKeyToPem(keypair.privateKey);
            const pemCertificate = node_forge_1.pki.certificateToPem(cert);
            return (0, node_https_1.createServer)({
                "key": pemPrivateKey,
                "cert": pemCertificate
            }, APP);
        });
    }
    else {
        return Promise.resolve((0, node_http_1.createServer)(APP));
    }
    // run server
}).then((server) => {
    server.listen(CONF.get("port"), () => {
        console.info("started" + (CONF.get("ssl") ? " with SSL" : ""), "on port " + CONF.get("port"));
    });
}).catch((err) => {
    console.error("");
    console.error("Impossible to initiate the application");
    console.error(err);
    console.error("");
    process.exitCode = 1;
    process.exit(1);
});
