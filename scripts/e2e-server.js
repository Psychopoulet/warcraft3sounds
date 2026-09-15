// deps

    // natives
    const { createServer } = require("node:http");

    // locals
    const { createTestApp } = require("../test/helpers/http.js");
    const { setupTestAppData, teardownTestAppData } = require("../test/helpers/model.js");

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
