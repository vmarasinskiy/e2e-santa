Feature: User can create a box and run it

    Scenario: User creates a box
        Given the user is logged in
        When the user creates a box with the name
        And adds participants
        And adds users
        Then the box is successfully created

    Scenario: User adds participants manually
        Given the user is logged in
        When the user navigates to the box and adds participants manually
        And adds participants manually
            | name  | email       |
            | vint | vint-dj@bk.ru |
            | vik | vikmatreshka@yandex.ru |
            | victor | vikmatreshka@rambler.ru |
        Then participants are successfully added

    Scenario: User conducts a prize drawing
        Given the user is logged in
        When the user conducts a prize drawing
        Then the drawing is successfully completed

    Scenario: User deletes the box
        Given the user is logged in
        When the user deletes the box
        Then the box is successfully deleted

