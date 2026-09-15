// deps

    // natives
    const { env } = require("node:process");

    // externals
    const { defineConfig } = require("@playwright/test");

// module

module.exports = defineConfig({
    "testDir": "./test/e2e",
    "fullyParallel": false,
    "forbidOnly": Boolean(env.CI),
    "retries": 1,
    "workers": 1,
    "use": {
        "baseURL": "http://127.0.0.1:8000",
        "browserName": "chromium"
    },
    "webServer": {
        "command": "node ./test/e2e/server.js",
        "url": "http://127.0.0.1:8000/health",
        "reuseExistingServer": !env.CI,
        "timeout": 60000
    }
});
