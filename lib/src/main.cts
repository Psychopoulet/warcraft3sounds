/* eslint-disable n/no-process-exit */
// n/no-process-exit : let main file to use process.exit() if needed

// deps

    // natives
    import { mkdir } from "node:fs/promises";
    import { stat } from "node:fs";
    import { join, dirname } from "node:path";
    import { homedir } from "node:os";

    // locals

    import getConf from "./conf";
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

        const conf = getConf();

        return conf.load().then((): void => {

            conf
                .set("port", conf.has("port") ? conf.get<number>("port") : 8000)
                .set("ssl", conf.has("ssl") ? conf.get<boolean>("ssl") : false)
                .set("database-file", conf.has("database-file") ? conf.get<string>("database-file") : join(homedir(), "warcraft3sounds", "warcraft3sounds.sqlite"));

        });

    }).then((): Promise<void> => {

        const dbStorage: string = getConf().get<string>("database-file");

        console.info("database :", dbStorage);

        const prepareDir: Promise<string | undefined> = ":memory:" === dbStorage
            ? Promise.resolve("")
            : mkdir(dirname(dbStorage), {
                "recursive": true
            });

        return prepareDir.then((): Promise<void> => {

            return getModel().init();

        });

    // generate web server

    }).then((): Express => {

        return generateServer();

    // generate routes

    }).then((app: Express): Express => {

        return registerRoutes(app);

    // run server
    }).then((app: Express): void => {

        const conf = getConf();

        app.listen(conf.get<number>("port"), (): void => {
            console.info("started" + (conf.get<boolean>("ssl") ? " with SSL" : ""), "on port " + conf.get<number>("port"));
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
