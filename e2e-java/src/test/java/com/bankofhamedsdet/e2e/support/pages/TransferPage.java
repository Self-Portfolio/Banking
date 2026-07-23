package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.WebDriver;

public class TransferPage extends BasePage {

    public TransferPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        driver.get(Config.FRONTEND_URL + "/transfer");
    }

    public void fillDetails(String toAccountNumber, String amount) {
        testId("transfer-to-account").clear();
        testId("transfer-to-account").sendKeys(toAccountNumber);
        testId("transfer-amount").clear();
        testId("transfer-amount").sendKeys(amount);
    }

    public void clickReview() {
        testId("transfer-review-button").click();
    }

    public String getReviewAmount() {
        return testId("review-amount").getText();
    }

    public void confirm() {
        testId("transfer-confirm-button").click();
    }

    public String getSuccessMessage() {
        return testId("transfer-success-message").getText();
    }

    public String getNewBalance() {
        return testId("transfer-new-balance").getText();
    }

    public String getErrorText() {
        return testId("transfer-error").getText();
    }
}
