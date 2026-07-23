package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class DashboardPage extends BasePage {

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        driver.get(Config.FRONTEND_URL + "/dashboard");
    }

    public String getUsername() {
        return testId("nav-username").getText();
    }

    public String getTotalBalanceText() {
        return testId("total-balance").getText();
    }

    public void logout() {
        testId("logout-button").click();
    }

    /** Locates an account card by its visible nickname rather than its numeric id, which isn't stable to hardcode in a test. */
    public void openAccountByNickname(String nickname) {
        By locator = By.xpath(
                "//*[@data-testid='account-list']//*[contains(normalize-space(text()), '" + nickname + "')]"
        );
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }
}
