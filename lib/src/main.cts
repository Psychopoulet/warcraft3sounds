// deps

    // natives
    import { createServer as createSecureServer } from "node:https";
    import { createServer as createServer } from "node:http";
    import { randomBytes } from "node:crypto";

    // externals
    import ConfManager from "node-confmanager";
    import { pki } from "node-forge";

    // locals

    import getModel from "./model";

    import generateServer from "./server/generateServer";

    import {
        pathPublicIndex,
        pathPublicApp,
        pathPublicAppMap,
        pathPublicIconW3,
        pathPublicIconTFT
    } from "./server/paths/public";

    import {
        pathSounds
    } from "./server/paths/sounds";

    import {
        pathAPISwagger,
        pathAPIIps,
        pathAPIAllRaces,
        pathAPIOneRace,
        pathAPIOneCharacter
    } from "./server/paths/api";

    import {
        redirect
    } from "./server/paths/redirect";

    import {
        pathErrorTest,
        pathErrorGlobal
    } from "./server/paths/errors";

// types & interfaces

    // natives
    import type { Server as SecureServer } from "node:https";
    import type { Server } from "node:http";

    // externals
    import type { Express } from "express";

    // locals
    import type { WarcraftSoundsModel } from "./model";

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

    }).then((): Promise<void> => {

        const model: WarcraftSoundsModel = getModel();

        return model.init();

    // generate web server

    }).then((): Express => {

        return generateServer();

    // generate routes

    }).then((app: Express): Express => {

        // public

            app
                .get("/public/index.html", pathPublicIndex)
                .get("/public/bundle.js", pathPublicApp)
                .get("/public/bundle.js.map", pathPublicAppMap)
                .get("/public/pictures/warcraft3.png", pathPublicIconW3)
                .get("/public/pictures/warcraft3TFT.png", pathPublicIconTFT);

        // sounds

            app.get("/public/sounds/:sound", pathSounds);

        // api

            app
                .get("/api/descriptor", pathAPISwagger)
                .get("/api/ips", pathAPIIps)
                .get("/api/races", pathAPIAllRaces)
                .get("/api/races/:race", pathAPIOneRace)
                .get("/api/races/:race/characters/:character", pathAPIOneCharacter);

        // redirections

            app
                .get("/", redirect("/public/index.html"))
                .get("/index.html", redirect("/public/index.html"))

                .get("/favicon.ico", redirect("/public/pictures/warcraft3.png"))
                .get("/favicon.png", redirect("/public/pictures/warcraft3.png"));

        // errors

            app.get("/api/err", pathErrorTest);

            // catch global error
            app.use(pathErrorGlobal);

        return app;

    }).then((app: Express): Promise<SecureServer | Server> => {

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
                }, app);

            });

        }
        else {

            return Promise.resolve(createServer(app));

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
