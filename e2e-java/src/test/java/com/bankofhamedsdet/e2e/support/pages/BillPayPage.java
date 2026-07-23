package com.bankofhamedsdet.e2e.support.pages;

import com.bankofhamedsdet.e2e.support.Config;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

public class BillPayPage extends BasePage {

    public BillPayPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        driver.get(Config.FRONTEND_URL + "/billpay");
    }

    public void selectPayee(String payeeName) {
        new Select(testId("billpay-payee-select")).selectByVisibleText(payeeName);
    }

    public void enterAmount(String amount) {
        testId("billpay-amount").clear();
        testId("billpay-amount").sendKeys(amount);
    }

    public void submitPayment() {
        testId("billpay-submit").click();
    }

    public String getSuccessMessage() {
        return testId("billpay-success").getText();
    }

    public String getErrorText() {
        return testId("billpay-error").getText();
    }

    public void clickAddPayee() {
        testId("show-add-payee").click();
    }

    public void fillNewPayee(String name, String accountNumber, String category) {
        testId("new-payee-name").sendKeys(name);
        testId("new-payee-account").sendKeys(accountNumber);
        testId("new-payee-category").sendKeys(category);
    }

    public void saveNewPayee() {
        testId("save-add-payee").click();
    }

    public boolean payeeListContains(String payeeName) {
        return testId("payee-list").getText().contains(payeeName);
    }

    public void removePayee(String payeeName) {
        By rowDeleteButton = By.xpath(
                "//*[@data-testid='payee-list']//li[contains(., '" + payeeName + "')]//button"
        );
        wait.until(ExpectedConditions.elementToBeClickable(rowDeleteButton)).click();
    }

    public boolean isSubmitDisabled() {
        return !testId("billpay-submit").isEnabled();
    }
}
