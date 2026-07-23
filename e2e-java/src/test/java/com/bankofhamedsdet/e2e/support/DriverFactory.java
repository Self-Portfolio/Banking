package com.bankofhamedsdet.e2e.support;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

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
