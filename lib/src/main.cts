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
    import registerRoutes from "./server/registerRoutes";

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

        return registerRoutes(app);

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
