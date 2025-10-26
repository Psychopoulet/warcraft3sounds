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
const model_1 = __importDefault(require("./model"));
const generateServer_1 = __importDefault(require("./server/generateServer"));
const public_1 = require("./server/paths/public");
const sounds_1 = require("./server/paths/sounds");
const api_1 = require("./server/paths/api");
const errors_1 = require("./server/paths/errors");
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
    const model = (0, model_1.default)();
    return model.init();
    // generate web server
}).then(() => {
    return (0, generateServer_1.default)();
    // generate routes
}).then((app) => {
    // public
    app
        .get(["/", "/index.html", "/public/index.html"], public_1.pathPublicIndex)
        .get("/public/bundle.js", public_1.pathPublicApp)
        .get("/public/bundle.js.map", public_1.pathPublicAppMap)
        .get(["/favicon.ico", "/favicon.png", "/public/pictures/warcraft3.png"], public_1.pathPublicIconW3)
        .get("/public/pictures/warcraft3TFT.png", public_1.pathPublicIconTFT);
    // sounds
    app.get("/public/sounds/:sound", sounds_1.pathSounds);
    // api
    app
        .get("/api/descriptor", api_1.pathAPISwagger)
        .get("/api/ips", api_1.pathAPIIps)
        .get("/api/races", api_1.pathAPIAllRaces)
        .get("/api/races/:race", api_1.pathAPIOneRace)
        .get("/api/races/:race/characters/:character", api_1.pathAPIOneCharacter);
    // errors
    app.get("/api/err", errors_1.pathErrorTest);
    // catch "not found" request
    app.use(errors_1.pathErrorNotFound);
    // catch global error
    app.use(errors_1.pathErrorGlobal);
    return app;
}).then((app) => {
    // generate server
    if (CONF.get("ssl")) {
        // to test : add certificate authority (CA)
        // https://node-security.com/posts/certificate-generation-pure-nodejs/
        // https://www.localcan.com/blog/self-signed-certificate-for-local-development-openssl-javascript
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
            }, app);
        });
    }
    else {
        return Promise.resolve((0, node_http_1.createServer)(app));
    }
    // run server
}).then((server) => {
    server.listen(CONF.get("port"), () => {
        console.info("started" + (CONF.get("ssl") ? " with SSL" : ""), "on port " + CONF.get("port"));
    });
    // graceful shutdown
}).then(() => {
    process.on("SIGINT", () => {
        const model = (0, model_1.default)();
        model.release().then(() => {
            process.exit(0);
        }).catch((err) => {
            console.error("");
            console.error("Impossible to properly end the application");
            console.error(err);
            console.error("");
            process.exitCode = 1;
            process.exit(1);
        });
    });
}).catch((err) => {
    console.error("");
    console.error("Impossible to initiate the application");
    console.error(err);
    console.error("");
    process.exitCode = 1;
    process.exit(1);
});
