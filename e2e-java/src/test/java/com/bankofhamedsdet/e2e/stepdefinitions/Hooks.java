package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.DriverFactory;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;

public class Hooks {

    @Before
    public void setUp() {
        DriverFactory.initDriver();
    }

    @After
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            dumpDiagnostics(scenario);
        }
        DriverFactory.quitDriver();
    }

    private void dumpDiagnostics(Scenario scenario) {
        WebDriver driver = DriverFactory.getDriver();

        System.out.println("=== FAILURE DIAGNOSTICS: " + scenario.getName() + " ===");
        try {
            System.out.println("Current URL: " + driver.getCurrentUrl());
            System.out.println("Page title: " + driver.getTitle());
        } catch (Exception e) {
            System.out.println("Could not read URL/title: " + e.getMessage());
        }

        try {
            for (LogEntry entry : driver.manage().logs().get(LogType.BROWSER)) {
                System.out.println("[browser console] " + entry.getLevel() + " " + entry.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Could not read browser console logs: " + e.getMessage());
        }

        try {
            String bodyText = (String) ((org.openqa.selenium.JavascriptExecutor) driver)
                    .executeScript("return document.body ? document.body.innerText.slice(0, 500) : '(no body)';");
            System.out.println("Body text snippet: " + bodyText);
        } catch (Exception e) {
            System.out.println("Could not read body text: " + e.getMessage());
        }

        try {
            byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", scenario.getName());
        } catch (Exception e) {
            System.out.println("Could not capture screenshot: " + e.getMessage());
        }
        System.out.println("=== END DIAGNOSTICS ===");
    }
}
