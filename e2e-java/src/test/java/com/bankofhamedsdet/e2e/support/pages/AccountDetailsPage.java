package com.bankofhamedsdet.e2e.support.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class AccountDetailsPage extends BasePage {

    public AccountDetailsPage(WebDriver driver) {
        super(driver);
    }

    public void search(String text) {
        WebElement input = testId("transaction-search");
        input.clear();
        input.sendKeys(text);
    }

    public void filterFrom(String isoDate) {
        fillDateInput(testId("transaction-from"), isoDate);
    }

    public void filterTo(String isoDate) {
        fillDateInput(testId("transaction-to"), isoDate);
    }

    /**
     * sendKeys on Chrome's native <input type="date"> depends on which
     * mm/dd/yyyy segment happens to be focused after a click, which isn't
     * reliably the first one. Instead we set the value through the
     * prototype's setter (bypassing React's own tracked setter) and then
     * dispatch a real "input" event, which is what makes React's onChange
     * actually fire with the new value.
     */
    private void fillDateInput(WebElement input, String isoDate) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript(
                "const input = arguments[0];"
                        + "const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;"
                        + "setter.call(input, arguments[1]);"
                        + "input.dispatchEvent(new Event('input', { bubbles: true }));",
                input, isoDate
        );
    }

    public void clickNextPage() {
        testId("pagination-next").click();
    }

    public void clickPreviousPage() {
        testId("pagination-prev").click();
    }

    public String getPaginationStatus() {
        return testId("pagination-status").getText();
    }

    public boolean isPreviousDisabled() {
        return !testId("pagination-prev").isEnabled();
    }

    public boolean isNextDisabled() {
        return !testId("pagination-next").isEnabled();
    }

    public boolean hasNoTransactionsMessage() {
        return !driver.findElements(byTestId("no-transactions")).isEmpty();
    }

    public int visibleTransactionRowCount() {
        return driver.findElements(By.cssSelector("[data-testid^='transaction-row-']")).size();
    }
}
