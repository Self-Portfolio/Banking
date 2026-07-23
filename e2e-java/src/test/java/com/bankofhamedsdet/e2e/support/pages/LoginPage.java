package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        driver.get(Config.FRONTEND_URL + "/login");
    }

    public void login(String username, String password) {
        testId("login-username").sendKeys(username);
        testId("login-password").sendKeys(password);
        testId("login-submit").click();
    }

    public String getErrorText() {
        return testId("login-error").getText();
    }
}
