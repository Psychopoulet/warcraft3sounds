// deps

    // locals
    import {
        pathPublicIndex,
        pathPublicApp,
        pathPublicAppMap,
        pathPublicIconW3,
        pathPublicIconTFT
    } from "./paths/public";

    import {
        pathSounds
    } from "./paths/sounds";

    import {
        pathAPISwagger,
        pathAPIAllRaces,
        pathAPIOneRace,
        pathAPIOneCharacter
    } from "./paths/api";

    import {
        redirect
    } from "./paths/redirect";

    import {
        pathErrorTest,
        pathErrorGlobal
    } from "./paths/errors";

// types & interfaces

    // externals
    import type { Express } from "express";

// module

export default function registerRoutes (app: Express): Express {

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
            .get("/api/races", pathAPIAllRaces)
            .get("/api/races/:racecode", pathAPIOneRace)
            .get("/api/races/:racecode/characters/:charactercode", pathAPIOneCharacter);

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

}
