package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.DriverFactory;
import com.bankofhamedsdet.e2e.support.pages.BillPayPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class BillPaySteps {

    private final BillPayPage billPayPage = new BillPayPage(DriverFactory.getDriver());

    @When("I go to the bill pay page")
    public void iGoToTheBillPayPage() {
        billPayPage.open();
    }

    @And("I pay {string} to payee {string}")
    public void iPayToPayee(String amount, String payeeName) {
        billPayPage.selectPayee(payeeName);
        billPayPage.enterAmount(amount);
        billPayPage.submitPayment();
    }

    @And("I add a payee named {string} with account number {string} in category {string}")
    public void iAddAPayeeNamedWithAccountNumberInCategory(String name, String accountNumber, String category) {
        billPayPage.clickAddPayee();
        billPayPage.fillNewPayee(name, accountNumber, category);
        billPayPage.saveNewPayee();
    }

    @When("I remove the payee {string}")
    public void iRemoveThePayee(String payeeName) {
        billPayPage.removePayee(payeeName);
    }

    @Then("I should see a bill pay success message containing {string}")
    public void iShouldSeeABillPaySuccessMessageContaining(String expectedText) {
        Assert.assertTrue(billPayPage.getSuccessMessage().contains(expectedText));
    }

    @Then("I should see a bill pay error containing {string}")
    public void iShouldSeeABillPayErrorContaining(String expectedText) {
        Assert.assertTrue(
                billPayPage.getErrorText().contains(expectedText),
                "Expected bill pay error to contain '" + expectedText + "' but was '" + billPayPage.getErrorText() + "'"
        );
    }

    @Then("the payee list should contain {string}")
    public void thePayeeListShouldContain(String payeeName) {
        Assert.assertTrue(billPayPage.payeeListContains(payeeName));
    }

    @Then("the payee list should not contain {string}")
    public void thePayeeListShouldNotContain(String payeeName) {
        Assert.assertFalse(billPayPage.payeeListContains(payeeName));
    }
}
