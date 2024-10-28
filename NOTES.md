# Reviewer instruction

- Go to the Typescript folder where the code is adapted
- test are configured vitest -> npm run test:vitest

# Development Process

- Review and understand both the requirements and the existing code.
- Prioritize requirements, addressing general cases first, followed by specific ones.
- Since maintaining backward compatibility might be important, before pushing changes to the main branch, either incrementally update and test each requirement or start from scratch. Given the small project scope, I opted to rebuild from scratch, which was achievable within a day.
- Using TDD, write tests for each requirement before implementing the corresponding code.
- Commit each successful test individually. Depending on the coding process within a team I could opt to commit first with a failing test and follow up then with commit for the passing test
- As part of a team:
  - I'd ask the team if I did understand all the requirements correctly.
  - Optionally, I'd check with a teammate the implementation of the first commit
  - At the end of the project I would send a pull request to peer review the code with a teammate

# Code Patterns and Practices

- Use of abstraction, by using private methods, to hide internal details
- Some OO principles are introduced by using the interfaces `ItemQualityValidator` and `ItemUpdater`:
  - Program to an interface
  - Favor composition over inheritance
  - Encapsulate what varies
  - Single Responsibility Principle
- Clean code best practices
  - Meaningful Names: Naming is hard, but I conveyed as much as possible of the meaning for function or a variable
  - Functions Should Be Small and Do One Thing
  - Self-Explanatory Code
  - Proper Error Handling with explicit error codes
  - Code Formatting with auto prettify
  - Avoid Code Duplication
  - TDD
- Keep backward compatibility by using default values in the constructor method
- Separate update logic in `ItemUpdater` for special items to avoid cluttering the code with numerous if statements in a single place, as seen in the initial code.
- Adopted immutability to prevent side effects; functions return new items rather than altering existing ones. The exception is for the `GildedRose` items state.
- Be pragmatic, start with working code and refactor the code where you see fit

# Improvements

- If multiple items require more complex update logic, consider introducing a DSL (domain-specific language) to configure rules declaratively. However, a DSL may add complexity and might not capture all the nuances achievable in code. Moreover this would introduce change in the constructor for `Item` and as per requirement the class `Item` could not be altered
- It could be beneficial to make `updateQuality` in `GildedRose` static. The client would then be responsible for maintaining the items state. However this is not implemented, as backward compatibility is not guaranteed and as per requirement the property `Items` could not be removed
