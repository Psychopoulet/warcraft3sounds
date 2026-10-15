// deps

    // natives
    const http = require("node:http");

// module

    // stop the program as soon as it is listening, from inside the process
    const { "listen": originalListen } = http.Server.prototype;

    http.Server.prototype.listen = function listen (...args) {

        const index = args.length - 1;

        if ("function" === typeof args[index]) {

            const callback = args[index];

            args[index] = (...passed) => {

                process.nextTick(() => {

                    process.emit("SIGTERM");

                });

                return callback(...passed);

            };

        }

        return originalListen.apply(this, args);

    };
