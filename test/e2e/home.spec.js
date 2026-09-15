const { test, expect } = require("@playwright/test");

test("home loads the test seed race", async ({ page, request }) => {

    const health = await request.get("/health");

    expect(health.ok()).toBeTruthy();
    expect(await health.json()).toEqual({
        "status": "ok"
    });

    await page.goto("/");
    await expect(page).toHaveTitle("Warcraft 3 sounds");
    await expect(page.getByRole("heading", { "name": "Humains" })).toBeVisible();

});
