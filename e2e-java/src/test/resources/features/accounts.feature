Feature: Account Transaction Search and Pagination
  As a logged-in bank customer
  I want to search and page through my transaction history
  So that I can find specific transactions in a large account

  Background:
    Given the banking demo data has been reset
    And I am logged in as "jdoe" with password "Password123!"
    And I open the "Everyday Checking" account

  Scenario: Paginating through transaction history
    Then the pagination status should show "Page 1 of 3"
    When I click the next page button
    Then the pagination status should show "Page 2 of 3"

  Scenario: The previous page button is disabled on the first page
    Then the previous page button should be disabled

  Scenario: The next page button is disabled on the last page
    When I click the next page button
    And I click the next page button
    Then the pagination status should show "Page 3 of 3"
    And the next page button should be disabled

  # Seeded bug - see ANSWER_KEY.md, Bug 2: search is case-sensitive even
  # though nothing in the UI suggests that it should be.
  Scenario: Transaction search is case-sensitive
    When I search transactions for "grocery"
    Then I should see no transactions found

  Scenario: Transaction search matches when the case is correct
    When I search transactions for "Grocery"
    Then I should see at least 1 transaction row

  # Seeded bug - see ANSWER_KEY.md, Bug 6: `from` is inclusive but `to` is
  # exclusive.
  Scenario: Date filters outside the transaction history return no results
    When I filter transactions from "2000-01-01" to "2000-01-02"
    Then I should see no transactions found
