# Contributing Guidelines

## Code Style

- We use **Prettier** for formatting and **ESLint** for linting.
- Run `npm run lint` before committing.

## Git Workflow

1. Create a feature branch: `feat/my-feature`
2. Commit changes with conventional commits: `feat: add login page`
3. Push to origin and open a Pull Request.

## Pull Request Process

1. Ensure all tests pass.
2. Update documentation if needed.
3. Request review from code owners.

## Adding New Tests

1. Create Page Object in `src/pages`.
2. Create Test Spec in `src/tests`.
3. Use data-test attributes for locators.
4. Add JSDoc comments.

## Performance Budget

- Page load: < 2s
- API response: < 500ms
