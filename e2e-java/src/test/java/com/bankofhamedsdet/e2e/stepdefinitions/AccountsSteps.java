package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.DriverFactory;
import com.bankofhamedsdet.e2e.support.pages.AccountDetailsPage;
import com.bankofhamedsdet.e2e.support.pages.DashboardPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class AccountsSteps {

    private final DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());
    private final AccountDetailsPage accountDetailsPage = new AccountDetailsPage(DriverFactory.getDriver());

    @Given("I open the {string} account")
    public void iOpenTheAccount(String nickname) {
        dashboardPage.open();
        dashboardPage.openAccountByNickname(nickname);
    }

    @When("I search transactions for {string}")
    public void iSearchTransactionsFor(String text) {
        accountDetailsPage.search(text);
    }

    @When("I filter transactions from {string} to {string}")
    public void iFilterTransactionsFromTo(String from, String to) {
        accountDetailsPage.filterFrom(from);
        accountDetailsPage.filterTo(to);
    }

    @When("I click the next page button")
    public void iClickTheNextPageButton() {
        accountDetailsPage.clickNextPage();
    }

    @Then("the pagination status should show {string}")
    public void thePaginationStatusShouldShow(String expectedText) {
        Assert.assertTrue(
                accountDetailsPage.getPaginationStatus().contains(expectedText),
                "Expected pagination status to contain '" + expectedText + "' but was '"
                        + accountDetailsPage.getPaginationStatus() + "'"
        );
    }

    @Then("the previous page button should be disabled")
    public void thePreviousPageButtonShouldBeDisabled() {
        Assert.assertTrue(accountDetailsPage.isPreviousDisabled());
    }

    @Then("the next page button should be disabled")
    public void theNextPageButtonShouldBeDisabled() {
        Assert.assertTrue(accountDetailsPage.isNextDisabled());
    }

    @Then("I should see no transactions found")
    public void iShouldSeeNoTransactionsFound() {
        Assert.assertTrue(accountDetailsPage.hasNoTransactionsMessage());
    }

    @Then("I should see at least {int} transaction row")
    public void iShouldSeeAtLeastTransactionRow(int minCount) {
        Assert.assertTrue(accountDetailsPage.visibleTransactionRowCount() >= minCount);
    }
}
