package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.WebDriver;

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
}
