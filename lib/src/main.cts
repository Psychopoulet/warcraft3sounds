/* eslint-disable n/no-process-exit */
// n/no-process-exit : let main file to use process.exit() if needed

// deps

    // natives
    import { mkdir } from "node:fs/promises";
    import { stat } from "node:fs";

    // externals
    import ConfManager from "node-confmanager";

    // locals

    import getModel from "./model";
    import getSoundsDirectory from "./tools/getSoundsDirectory";

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
    import type { Stats } from "node:fs";

    // externals
    import type { Express } from "express";

    // locals
    import type { WarcraftSoundsModel } from "./model";

// consts

    const CONF: ConfManager = new ConfManager("test");

// module

    // generate conf

    const finalSoundsDir = getSoundsDirectory(); // for docker, or after first launch

    console.info("sounds directory :", finalSoundsDir);

    new Promise((resolve: (exists: boolean) => void): void => {

        stat(finalSoundsDir, (err: NodeJS.ErrnoException | null, stats: Stats): void => {
            return err || !stats.isDirectory() ? resolve(false) : resolve(true);
        });

    }).then((exists: boolean): Promise<string | undefined> => {

        if (exists) {
            return Promise.resolve("");
        }

        console.info("sounds directory not found, try to create it", finalSoundsDir);

        return mkdir(finalSoundsDir, {
            "recursive": true
        });

    }).then((): Promise<void> => {

        CONF
            .skeleton("port", "integer")
            .document("port", "Port used by the server")

            .skeleton("ssl", "boolean")
            .document("ssl", "Is SSL activated ?");

        return CONF.load().then((): void => {

            CONF
                .set("port", CONF.has("port") ? CONF.get<number>("port") : 8000)
                .set("ssl", CONF.has("ssl") ? CONF.get<boolean>("ssl") : false);

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
                .get("/public/bundle.min.js", pathPublicApp)
                .get("/public/bundle.min.js.map", pathPublicAppMap)
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
                .get("/public/bundle.js", redirect("/public/bundle.min.js"))
                .get("/public/bundle.js.map", redirect("/public/bundle.min.js.map"))

                .get("/favicon.ico", redirect("/public/pictures/warcraft3.png"))
                .get("/favicon.png", redirect("/public/pictures/warcraft3.png"));

        // errors

            app.get("/api/err", pathErrorTest);

            // catch global error
            app.use(pathErrorGlobal);

        return app;

    // run server
    }).then((app: Express): void => {

        app.listen(CONF.get<number>("port"), (): void => {
            console.info("started" + (CONF.get<boolean>("ssl") ? " with SSL" : ""), "on port " + CONF.get<number>("port"));
        });

    // graceful shutdown (SIGINT = tty ; SIGTERM = Docker / Compose)
    }).then((): void => {

        function _handleKill (): void {

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

        }

        process.on("SIGINT", _handleKill);
        process.on("SIGTERM", _handleKill);

    }).catch((err: Error): void => {

        console.error("");
        console.error("Impossible to initiate the application");
        console.error(err);
        console.error("");

        process.exitCode = 1;
        process.exit(1);

    });
