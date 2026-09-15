/* eslint-disable n/no-process-exit */
// n/no-process-exit : let the e2e server stop on SIGINT/SIGTERM and startup errors

// deps

    // natives
    const { createServer } = require("node:http");

    // locals
    const { createTestApp } = require("../helpers/http.js");
    const { setupTestAppData, teardownTestAppData } = require("../helpers/model.js");

// consts

    const HOST = "127.0.0.1";
    const PORT = 8000;

// module

    setupTestAppData().then((model) => {

        const server = createServer(createTestApp());

        function _shutdown () {

            server.close(() => {

                teardownTestAppData(model).then(() => {

                    process.exit(0);

                }).catch((err) => {

                    console.error(err);
                    process.exit(1);

                });

            });

        }

        process.on("SIGINT", _shutdown);
        process.on("SIGTERM", _shutdown);

        server.listen(PORT, HOST, () => {

            console.info("e2e server listening on http://" + HOST + ":" + PORT);

        });

    }).catch((err) => {

        console.error(err);
        process.exit(1);

    });
