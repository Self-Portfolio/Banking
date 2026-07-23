package com.bankofhamedsdet.e2e.stepdefinitions;

import com.bankofhamedsdet.e2e.support.DriverFactory;
import com.bankofhamedsdet.e2e.support.pages.TransferPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class TransferSteps {

    private final TransferPage transferPage = new TransferPage(DriverFactory.getDriver());

    @When("I go to the transfer page")
    public void iGoToTheTransferPage() {
        transferPage.open();
    }

    @When("I transfer {string} to account number {string}")
    public void iTransferToAccountNumber(String amount, String toAccountNumber) {
        transferPage.fillDetails(toAccountNumber, amount);
        transferPage.clickReview();
    }

    @And("I confirm the transfer")
    public void iConfirmTheTransfer() {
        transferPage.confirm();
    }

    @Then("I should see the review screen with amount {string}")
    public void iShouldSeeTheReviewScreenWithAmount(String expectedAmount) {
        Assert.assertEquals(transferPage.getReviewAmount(), expectedAmount);
    }

    @Then("I should see the review screen")
    public void iShouldSeeTheReviewScreen() {
        Assert.assertNotNull(transferPage.getReviewAmount());
    }

    @Then("I should see a success message containing {string}")
    public void iShouldSeeASuccessMessageContaining(String expectedText) {
        Assert.assertTrue(transferPage.getSuccessMessage().contains(expectedText));
    }

    @Then("the new balance should be {string}")
    public void theNewBalanceShouldBe(String expectedBalance) {
        Assert.assertEquals(transferPage.getNewBalance(), expectedBalance);
    }

    @Then("I should see a transfer error containing {string}")
    public void iShouldSeeATransferErrorContaining(String expectedText) {
        Assert.assertTrue(
                transferPage.getErrorText().contains(expectedText),
                "Expected transfer error to contain '" + expectedText + "' but was '" + transferPage.getErrorText() + "'"
        );
    }
}
