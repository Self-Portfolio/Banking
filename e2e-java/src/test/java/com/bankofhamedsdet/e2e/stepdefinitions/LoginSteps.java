package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.DriverFactory;
import com.bankofhamedsdet.e2e.support.pages.DashboardPage;
import com.bankofhamedsdet.e2e.support.pages.LoginPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class LoginSteps {

    private final LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
    private final DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        loginPage.open();
    }

    @When("I log in with username {string} and password {string}")
    public void iLogInWith(String username, String password) {
        loginPage.login(username, password);
    }

    @When("I navigate directly to the dashboard")
    public void iNavigateDirectlyToTheDashboard() {
        dashboardPage.open();
    }

    @When("I log out")
    public void iLogOut() {
        dashboardPage.logout();
    }

    @Then("I should be redirected to the dashboard")
    public void iShouldBeRedirectedToTheDashboard() {
        dashboardPage.waitForUrlContains("/dashboard");
    }

    @Then("I should be redirected to the login page")
    public void iShouldBeRedirectedToTheLoginPage() {
        loginPage.waitForUrlContains("/login");
    }

    @Then("I should see the account holder name {string}")
    public void iShouldSeeTheAccountHolderName(String expectedName) {
        Assert.assertEquals(dashboardPage.getUsername(), expectedName);
    }

    @Then("I should see a total balance of {string}")
    public void iShouldSeeATotalBalanceOf(String expectedAmount) {
        Assert.assertTrue(
                dashboardPage.getTotalBalanceText().contains(expectedAmount),
                "Expected total balance to contain " + expectedAmount + " but was " + dashboardPage.getTotalBalanceText()
        );
    }

    @Then("I should see a login error message")
    public void iShouldSeeALoginErrorMessage() {
        Assert.assertFalse(loginPage.getErrorText().isEmpty());
    }
}
