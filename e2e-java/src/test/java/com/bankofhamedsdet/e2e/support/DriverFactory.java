package com.bankofhamedsdet.e2e.support;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;

import java.util.logging.Level;

/**
 * One WebDriver instance per thread so the suite can later be switched to
 * parallel="methods"/"classes" in testng.xml without any step definition
 * changes.
 */
public final class DriverFactory {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverFactory() {
    }

    public static void initDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        if (Config.HEADLESS) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1440,900");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");
        // Standard hardening for shared/CI runners: avoids sandbox
        // permission issues and /dev/shm exhaustion under load.
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        // Capture browser console output so a JS runtime error can be
        // surfaced on failure instead of just "element never appeared".
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        options.setCapability("goog:loggingPrefs", logPrefs);

        DRIVER.set(new ChromeDriver(options));
    }

    public static WebDriver getDriver() {
        return DRIVER.get();
    }

    public static void quitDriver() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            driver.quit();
            DRIVER.remove();
        }
    }
}
