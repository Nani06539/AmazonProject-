@amazon
Feature: Searching items on Amazon

  Background: User is  already on Amazon home page
    Given User is on amazon home page

  Scenario: TC1- Searching LG 24UD58-B 24-Inch 4k Monitor

    When   User search for LG 24UD58-B 24-Inch 4k Monitor
    And    User Chooses LG 24UD58-B 24-Inch 4k Monitor
    Then   User Should be able to add it to cart


  Scenario:  TC2- Searching Metasploit: The Penetration Tester's Guide Book

    When  User search for The Metasploit: The Penetration Tester's Guide Book
    And   User clicks on Metasploit: The Penetration Tester's Guide Book
    Then   User Should be able to add it to cart


  Scenario: TC3- Searching a cup with a cat on it

    When   User search for a cup with a cat on it
    And    User clicks on the favirote cup
    And    User should be able to take the screenshot of the page
    Then   User Should be able to add it to cart


  Scenario: TC3- Removing the Metasploit: The Penetration Tester's Guide Book from the cart and confirm it is removed from the cart

    When  User removes the LG 24UD58-B 24-Inch 4k Monitor from the cart
    Then  User should not see the LG 24UD58-B 24-Inch 4k Monitor in the cart

