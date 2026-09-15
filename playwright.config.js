const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    "testDir": "./test/e2e",
    "fullyParallel": false,
    "forbidOnly": Boolean(process.env.CI),
    "retries": 1,
    "workers": 1,
    "use": {
        "baseURL": "http://127.0.0.1:8000",
        "browserName": "chromium"
    },
    "webServer": {
        "command": "node ./scripts/e2e-server.js",
        "url": "http://127.0.0.1:8000/health",
        "reuseExistingServer": !process.env.CI,
        "timeout": 60000
    }
});
