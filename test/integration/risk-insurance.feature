Feature: Risk Insurance

  Rule: POST /insurance

  Rule: age is required.

  Rule: dependents is required.

  Rule: income is required.

  Rule: marital_status is required.

  Rule: risk_questions is required.

    Scenario: Scenario: Should not accept a request without body
      Given the path is '/insurance'
      And method is 'POST'
      When making request
      Then expect the following response:
          """
          {
             "errors": [{
               "message": "Invalid body"
             }]
          }
          """
      And expect a "422" status code

    Scenario: Scenario: Should calculate insurance for valid body
      Given the path is '/insurance'
      And method is 'POST'
      And request body:
        """
        {
          "age":35,
          "dependents":2,
          "income":0,
          "house":{
            "ownership_status":"owned"
          },
          "marital_status":"married",
          "risk_questions":[
            0,
            1,
            0
          ],
          "vehicle":{
            "year":2018
          }
        }
        """
      When making request
      Then expect the following response:
        """
        {
          "auto":"regular",
          "disability":"ineligible",
          "home":"economic",
          "life":"regular"
        }
        """
      And expect a "200" status code
