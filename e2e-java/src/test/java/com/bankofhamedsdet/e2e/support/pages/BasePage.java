package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public abstract class BasePage {

    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(Config.DEFAULT_TIMEOUT_SECONDS));
    }

    /** Every interactive element in the app carries a stable data-testid - this is the one locator strategy the whole suite uses. */
    protected By byTestId(String testId) {
        return By.cssSelector("[data-testid='" + testId + "']");
    }

    protected WebElement testId(String testId) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(byTestId(testId)));
    }

    public void waitForUrlContains(String fragment) {
        wait.until(ExpectedConditions.urlContains(fragment));
    }
}
