Feature: Login
  As a bank customer
  I want to sign in to my account
  So that I can manage my money online

  Background:
    Given the banking demo data has been reset

  Scenario: Successful login with valid demo credentials
    Given I am on the login page
    When I log in with username "jdoe" and password "Password123!"
    Then I should be redirected to the dashboard
    And I should see the account holder name "Jane Doe"
    And I should see a total balance of "$17,050.75"

  Scenario: Login fails with an incorrect password
    Given I am on the login page
    When I log in with username "jdoe" and password "wrong-password"
    Then I should see a login error message

  Scenario: Unauthenticated users are redirected away from the dashboard
    When I navigate directly to the dashboard
    Then I should be redirected to the login page

  Scenario: Logging out returns to the login page
    Given I am on the login page
    When I log in with username "jdoe" and password "Password123!"
    Then I should be redirected to the dashboard
    When I log out
    Then I should be redirected to the login page
