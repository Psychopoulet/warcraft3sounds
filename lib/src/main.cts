/* eslint-disable n/no-process-exit, n/no-process-env */
// n/no-process-exit : let main file to use process.exit() if needed
// n/no-process-env : let main file to default NODE_ENV to "development" when it is missing

// deps

    // natives
    import { mkdir } from "node:fs/promises";
    import { stat } from "node:fs";
    import { join, dirname } from "node:path";
    import { homedir } from "node:os";

    // locals

    import getConf from "./conf";
    import getModel from "./db/model";
    import getSoundsDirectory from "./tools/getSoundsDirectory";
    import getLogger, { initLogger } from "./tools/getLogger";
    import closeServer from "./tools/closeServer";

    import generateServer from "./server/generateServer";
    import registerRoutes from "./server/registerRoutes";

// types & interfaces

    // natives
    import type { Stats } from "node:fs";
    import type { Server } from "node:http";

    // externals
    import type { Express } from "express";

    // locals
    import type { WarcraftSoundsModel } from "./db/model";

// module

    // generate conf

    if ("undefined" === typeof process.env.NODE_ENV || "" === process.env.NODE_ENV) {
        process.env.NODE_ENV = "development";
    }

    const finalSoundsDir = getSoundsDirectory(); // for docker, or after first launch

    initLogger().then((): Promise<boolean> => {

        getLogger().info("sounds directory : " + finalSoundsDir);

        return new Promise((resolve: (exists: boolean) => void): void => {

            stat(finalSoundsDir, (err: NodeJS.ErrnoException | null, stats: Stats): void => {
                return err || !stats.isDirectory() ? resolve(false) : resolve(true);
            });

        });

    }).then((exists: boolean): Promise<string | undefined> => {

        if (exists) {
            return Promise.resolve("");
        }

        getLogger().info("sounds directory not found, try to create it " + finalSoundsDir);

        return mkdir(finalSoundsDir, {
            "recursive": true
        });

    }).then((): Promise<void> => {

        const conf = getConf();

        return conf.load().then((): void => {

            conf
                .set("port", conf.has("port") ? conf.get<number>("port") : 8000)
                .set("database-file", join(homedir(), "warcraft3sounds", "db", "warcraft3sounds.sqlite"));

        });

    }).then((): Promise<void> => {

        const dbStorage: string = getConf().get<string>("database-file");

        getLogger().info("database : " + dbStorage);

        return mkdir(dirname(dbStorage), {
            "recursive": true
        }).then((): Promise<void> => {

            return getModel().init();

        });

    // generate web server

    }).then((): Promise<Express> => {

        return generateServer();

    // generate routes

    }).then((app: Express): Express => {

        return registerRoutes(app);

    // run server
    }).then((app: Express): Server => {

        const conf = getConf();

        // the handle is kept to stop accepting connections during the graceful shutdown
        return app.listen(conf.get<number>("port"), (): void => {

            getLogger().info("started on port " + String(conf.get<number>("port")));

        });

    // graceful shutdown (SIGINT = tty ; SIGTERM = Docker / Compose)
    }).then((server: Server): void => {

        function _handleKill (): void {

            const model: WarcraftSoundsModel = getModel();

            closeServer(server).then((): Promise<void> => {

                return model.release();

            }).then((): void => {

                process.exit(0);

            }).catch((err: Error): void => {

                getLogger().error("Impossible to properly end the application\n" + (err.stack ?? err.message));
                process.exitCode = 1;
                process.exit(1);

            });

        }

        process.on("SIGINT", _handleKill);
        process.on("SIGTERM", _handleKill);

    }).catch((err: Error): void => {

        try {
            getLogger().critical("Impossible to initiate the application\n" + (err.stack ?? err.message));
        }
        catch {

            // the logger never started

        }

        process.exitCode = 1;
        process.exit(1);

    });
