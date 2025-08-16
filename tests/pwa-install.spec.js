import { test, expect } from "@playwright/test";

test.describe("PWA Installation", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear storage before each test
    await context.clearCookies();
    try {
      await page.evaluate(() => {
        if (typeof Storage !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    } catch (e) {
      // Storage might not be available in some contexts, ignore
      console.log("Storage clear failed:", e.message);
    }
  });

  test("should have PWA manifest and service worker", async ({ page }) => {
    await page.goto("/");

    // Check that manifest is loaded
    const manifestLink = page.locator('link[rel="manifest"]').first();
    await expect(manifestLink).toBeAttached();

    // Check manifest content
    const manifestHref = await manifestLink.getAttribute("href");
    const manifestResponse = await page.request.get(manifestHref);
    expect(manifestResponse.ok()).toBeTruthy();

    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe("Fait-il plus beau à Lorient qu'à Brest ?");
    expect(manifest.short_name).toBe("Fipbal");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toHaveLength(3);

    // Wait for service worker to be registered
    await page.waitForFunction(() => {
      return "serviceWorker" in navigator && navigator.serviceWorker.ready;
    });

    // Check service worker registration in console
    const serviceWorkerLogs = [];
    page.on("console", (msg) => {
      if (msg.text().includes("Service Worker")) {
        serviceWorkerLogs.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(2000);

    expect(
      serviceWorkerLogs.some((log) => log.includes("Service Worker registered"))
    ).toBeTruthy();
  });

  test("should detect PWA install capabilities", async ({ page }) => {
    // Listen for PWA debug logs
    const pwaLogs = [];
    page.on("console", (msg) => {
      if (msg.text().includes("🔧 PWA Debug:")) {
        pwaLogs.push(msg.text());
      }
    });

    await page.goto("/");

    // Wait for PWA initialization
    await page.waitForTimeout(3000);

    // Check that PWA debug logs are present
    expect(pwaLogs.length).toBeGreaterThan(0);
    expect(
      pwaLogs.some((log) => log.includes("Starting initialization"))
    ).toBeTruthy();
    expect(
      pwaLogs.some((log) => log.includes("Manifest link found"))
    ).toBeTruthy();

    // Check if install banner appears (either native or fallback)
    const installBanner = page.locator('[data-testid="pwa-install-banner"]');

    // Wait up to 6 seconds for the install banner to appear
    try {
      await installBanner.waitFor({ timeout: 6000 });
      await expect(installBanner).toBeVisible();

      // Check button text
      const installButton = installBanner.locator("button").first();
      const buttonText = await installButton.textContent();
      expect(buttonText.trim()).toContain("Install");
    } catch (error) {
      // If banner doesn't appear, log the PWA debug info for troubleshooting
      console.log("Install banner did not appear. PWA Debug logs:");
      pwaLogs.forEach((log) => console.log(log));
      throw error;
    }
  });

  test("should handle install button click", async ({ page }) => {
    await page.goto("/");

    // Wait for install banner
    const installBanner = page.locator('[data-testid="pwa-install-banner"]');
    await installBanner.waitFor({ timeout: 6000 });

    const installButton = installBanner.locator("button").first();

    // Listen for beforeinstallprompt event
    let promptEventFired = false;
    await page.addInitScript(() => {
      window.addEventListener("beforeinstallprompt", () => {
        window.promptEventReceived = true;
      });
    });

    // Click install button
    await installButton.click();

    // Check if native prompt was triggered or fallback shown
    const promptReceived = await page.evaluate(
      () => window.promptEventReceived
    );

    if (promptReceived) {
      // Native install prompt should have been triggered
      console.log("Native install prompt was triggered");
    } else {
      // Fallback instructions should be shown
      console.log("Fallback install instructions shown");
    }
  });

  test("should be installable according to Chrome DevTools", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    // Wait for service worker and manifest to load
    await page.waitForTimeout(3000);

    // Use Chrome DevTools Protocol to check PWA installability
    const client = await context.newCDPSession(page);

    // Enable necessary domains
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    // Check if page meets PWA criteria
    const manifest = await client.send("Page.getAppManifest");
    expect(manifest.url).toBeTruthy();
    expect(manifest.data).toBeTruthy();

    // Parse manifest data
    const manifestData = JSON.parse(manifest.data);
    expect(manifestData.name).toBe("Fait-il plus beau à Lorient qu'à Brest ?");
    expect(manifestData.icons.length).toBeGreaterThan(0);
    expect(manifestData.start_url).toBe("/");
    expect(manifestData.display).toBe("standalone");
  });

  test("should dismiss install banner and remember choice", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for install banner
    const installBanner = page.locator('[data-testid="pwa-install-banner"]');
    await installBanner.waitFor({ timeout: 6000 });

    // Click dismiss button
    const dismissButton = installBanner.locator("button").last();
    await dismissButton.click();

    // Banner should disappear
    await expect(installBanner).not.toBeVisible();

    // Reload page and check that banner doesn't appear again
    await page.reload();
    await page.waitForTimeout(6000);

    await expect(installBanner).not.toBeVisible();

    // Check that dismissed state is stored in localStorage
    const dismissed = await page.evaluate(() => {
      try {
        return localStorage.getItem("pwa-install-dismissed");
      } catch (e) {
        return null;
      }
    });
    expect(dismissed).toBe("true");
  });
});
