Feature: Bill Pay
  As a logged-in bank customer
  I want to pay bills and manage payees
  So that I can handle recurring payments

  Background:
    Given the banking demo data has been reset
    And I am logged in as "jdoe" with password "Password123!"

  Scenario: Successfully pay a bill
    When I go to the bill pay page
    And I pay "50" to payee "Electric Company"
    Then I should see a bill pay success message containing "sent successfully"

  Scenario: A bill payment that exceeds the available balance is rejected
    When I go to the bill pay page
    And I pay "999999" to payee "Electric Company"
    Then I should see a bill pay error containing "Insufficient funds"

  Scenario: Add a new payee
    When I go to the bill pay page
    And I add a payee named "Internet Provider" with account number "NET-1234" in category "Utilities"
    Then the payee list should contain "Internet Provider"

  Scenario: Remove an existing payee
    When I go to the bill pay page
    Then the payee list should contain "Acme Credit Card"
    When I remove the payee "Acme Credit Card"
    Then the payee list should not contain "Acme Credit Card"
