package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.ApiClient;
import com.bankofhamedsdet.e2e.support.DriverFactory;
import com.bankofhamedsdet.e2e.support.pages.DashboardPage;
import com.bankofhamedsdet.e2e.support.pages.LoginPage;
import io.cucumber.java.en.Given;

public class CommonSteps {

    @Given("the banking demo data has been reset")
    public void theBankingDemoDataHasBeenReset() {
        ApiClient.resetDemoData();
    }

    @Given("I am logged in as {string} with password {string}")
    public void iAmLoggedInAs(String username, String password) {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        loginPage.open();
        loginPage.login(username, password);
        // Wait for the redirect to complete (and the JWT to land in
        // localStorage) before any later step hard-navigates elsewhere.
        new DashboardPage(DriverFactory.getDriver()).waitForUrlContains("/dashboard");
    }
}
