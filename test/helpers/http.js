// deps

    // natives
    const { createServer, get } = require("node:http");

    // locals
    const generateServer = require("../../lib/cjs/server/generateServer.js").default;
    const registerRoutes = require("../../lib/cjs/server/registerRoutes.js").default;
    const { setupTestAppData, teardownTestAppData } = require("./model.js");

// module

    function createTestApp () {

        return registerRoutes(generateServer());

    }

    function listenApp (app) {

        const server = createServer(app);

        return new Promise((resolve, reject) => {

            server.once("error", reject);

            server.listen(0, "127.0.0.1", () => {

                server.removeListener("error", reject);

                resolve({
                    server,
                    "baseUrl": "http://127.0.0.1:" + server.address().port
                });

            });

        });

    }

    function closeServer (server) {

        return new Promise((resolve, reject) => {

            server.close((err) => {
                return err ? reject(err) : resolve();
            });

        });

    }

    function startHttpTest () {

        return setupTestAppData().then((model) => {

            return listenApp(createTestApp()).then((listening) => {

                return {
                    model,
                    "server": listening.server,
                    "baseUrl": listening.baseUrl
                };

            });

        });

    }

    function stopHttpTest (ctx) {

        return closeServer(ctx.server).then(() => {

            return teardownTestAppData(ctx.model);

        });

    }

    function request (baseUrl, path) {

        return new Promise((resolve, reject) => {

            get(baseUrl + path, (res) => {

                const chunks = [];

                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });

                res.on("end", () => {

                    resolve({
                        "status": res.statusCode,
                        "headers": res.headers,
                        "body": Buffer.concat(chunks)
                    });

                });

            }).on("error", reject);

        });

    }

    function requestJson (baseUrl, path) {

        return request(baseUrl, path).then((res) => {

            return {
                "status": res.status,
                "headers": res.headers,
                "json": JSON.parse(res.body.toString("utf8"))
            };

        });

    }

module.exports = {
    createTestApp,
    listenApp,
    closeServer,
    startHttpTest,
    stopHttpTest,
    request,
    requestJson
};
