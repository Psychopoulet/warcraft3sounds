// deps

    // natives
    import { createServer as createSecureServer } from "node:https";
    import { createServer as createServer } from "node:http";
    import { randomBytes } from "node:crypto";

    // externals
    import ConfManager from "node-confmanager";
    import { pki } from "node-forge";

    // locals

    import logRequest from "./tools/logRequest";
    import getRequestPath from "./tools/getRequestPath";
    import errorCodes from "./returncodes";

    import generateServer from "./server/generateServer";
    import webRoutes from "./server/webRoutes";
    import apiRoutes from "./api/apiRoutes";
    import soundsRoutes from "./api/soundsRoutes";
    import getModel from "./api/model";

// types & interfaces

    // natives
    import type { Server as SecureServer } from "node:https";
    import type { Server } from "node:http";

    // externals
    import type { Express, Request, Response, NextFunction } from "express";

    // locals
    import type { WarcraftSoundsModel } from "./api/model";

// consts

    const CONF: ConfManager = new ConfManager("test");

// module

    // generate conf
    Promise.resolve().then((): Promise<void> => {

        CONF.skeleton("port", "integer").document("port", "Port used by the server");
        CONF.skeleton("ssl", "boolean").document("ssl", "Is SSL activated ?");

        return CONF.load().then((): void => {

            CONF.set("port", CONF.has("port") ? CONF.get("port") : 3000);
            CONF.set("ssl", CONF.has("ssl") ? CONF.get("ssl") : false);

        });

    }).then((): Express => {

        return generateServer();

    // generate routes

    }).then((APP: Express): Promise<Express> => {

        webRoutes(APP);
        soundsRoutes(APP);

        return apiRoutes(APP).then((): Express => {
            return APP;
        });

    // generate web server

    }).then((APP: Express): Promise<SecureServer | Server> => {

        // catch "not found" request
        APP.use((req: Request, res: Response, next: NextFunction): void => {

            logRequest(req);
            console.error("Not found");

            if (res.headersSent) {
                return next("Not found");
            }
            else {

                res.status(errorCodes.NOTFOUND).json({
                    "code": errorCodes.NOTFOUND,
                    "message": getRequestPath(req) + " not found"
                });

            }

        });

        // catch error
        APP.use((err: Error, req: Request, res: Response, next: NextFunction): void => {

            logRequest(req);

            console.error(err);

            if (res.headersSent) {
                return next(err);
            }
            else {

                res.status(errorCodes.INTERNAL).json({
                    "code": errorCodes.INTERNAL,
                    "message": err.message
                });

            }

        });

        // generate server

        if (CONF.get("ssl")) {

            // to test : add certificate authority (CA)
            // https://node-security.com/posts/certificate-generation-pure-nodejs/
            // https://www.localcan.com/blog/self-signed-certificate-for-local-development-openssl-javascript

            return new Promise((resolve: (keypair: pki.rsa.KeyPair) => void, reject: (err: Error) => void): void => {

                pki.rsa.generateKeyPair({
                    "bits": 4096,
                    "workers": 2
                }, (err: Error, keypair: pki.rsa.KeyPair): void => {
                    return err ? reject(err) : resolve(keypair);
                });

            }).then((keypair: pki.rsa.KeyPair): SecureServer => {

                const cert: pki.Certificate = pki.createCertificate();

                cert.publicKey = keypair.publicKey;
                cert.serialNumber = "01" + randomBytes(19).toString("hex"); // 1 octet = 8 bits = 1 byte = 2 hex chars (https://advancedweb.hu/how-to-generate-an-https-certificate-with-node-forge/)
                cert.validity.notBefore = new Date();
                cert.validity.notAfter = new Date();
                cert.validity.notAfter.setFullYear(new Date().getFullYear() + 1); // one year validity

                const SSL_OPTIONS: Array<{
                    "name": string;
                    "value": string;
                }> = [
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

                const SSL_EXTENSIONS: Array<Record<string, any>> = [
                    {
                        "name": "subjectAltName",
                        "altNames": [ // types : 2 = dns name, 6 = URI, 7 = IP
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

                const pemPrivateKey: string = pki.privateKeyToPem(keypair.privateKey);
                const pemCertificate: string = pki.certificateToPem(cert);

                return createSecureServer({
                    "key": pemPrivateKey,
                    "cert": pemCertificate
                }, APP);

            });

        }
        else {

            return Promise.resolve(createServer(APP));

        }

    // run server
    }).then((server: SecureServer | Server): void => {

        server.listen(CONF.get("port"), (): void => {
            console.info("started" + (CONF.get("ssl") ? " with SSL" : ""), "on port " + CONF.get("port"));
        });

    // graceful shutdown
    }).then((): void => {

        process.on("SIGINT", (): void => {

            const model: WarcraftSoundsModel = getModel();

            model.release().then((): void => {

                process.exit(0);

            }).catch((err: Error): void => {

                console.error("");
                console.error("Impossible to properly end the application");
                console.error(err);
                console.error("");

                process.exitCode = 1;
                process.exit(1);

            });

        });

    }).catch((err: Error): void => {

        console.error("");
        console.error("Impossible to initiate the application");
        console.error(err);
        console.error("");

        process.exitCode = 1;
        process.exit(1);

    });
