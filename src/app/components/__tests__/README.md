# Component Tests Organization

This folder contains tests for the components in the parent directory.

## Structure
- Each component in `../` should have its own test file(s) here.
- Test files are named using the pattern:
  - `ComponentName.unit.test.tsx` for unit tests
  - `ComponentName.a11y.test.tsx` for accessibility (axe) tests
  - `ComponentName.integration.test.tsx` for integration tests (if needed)

## Why this structure?
- Keeps tests close to the code they test, making it easy to find and update tests when components change.
- Supports multiple test types per component without cluttering the main component directory.

## Example
```
components/
  AudioControls.tsx
  OptionControls.tsx
  __tests__/
    AudioControls.a11y.test.tsx
    AudioControls.unit.test.tsx
    OptionControls.a11y.test.tsx
    OptionControls.unit.test.tsx
    README.md
```

## Shared Test Utilities
- Place any shared test helpers or mocks in a `test-utils/` folder at the project or app level.

---
Happy testing! 