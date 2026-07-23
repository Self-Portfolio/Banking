Feature: Fund Transfers
  As a logged-in bank customer
  I want to transfer money between accounts
  So that I can move my funds where I need them

  Background:
    Given the banking demo data has been reset
    And I am logged in as "jdoe" with password "Password123!"

  Scenario: Successfully transfer funds between my own accounts
    When I go to the transfer page
    And I transfer "100" to account number "1000200031"
    Then I should see the review screen with amount "$100.00"
    When I confirm the transfer
    Then I should see a success message containing "completed successfully"
    And the new balance should be "$4,150.75"

  Scenario: A transfer that exceeds the available balance is rejected
    When I go to the transfer page
    And I transfer "999999" to account number "1000200031"
    And I confirm the transfer
    Then I should see a transfer error containing "Insufficient funds"

  Scenario: A transfer to an account number that does not exist is rejected
    When I go to the transfer page
    And I transfer "10" to account number "0000000000"
    And I confirm the transfer
    Then I should see a transfer error containing "not found"

  # Seeded bug (see ANSWER_KEY.md, Bug 4): the client only blocks negative
  # amounts, so a zero-amount transfer reaches the review screen and only
  # fails once it hits the server.
  Scenario: A zero-amount transfer passes client validation but fails on the server
    When I go to the transfer page
    And I transfer "0" to account number "1000200031"
    Then I should see the review screen
    When I confirm the transfer
    Then I should see a transfer error containing "positive number"
