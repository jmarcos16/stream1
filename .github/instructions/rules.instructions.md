---
applyTo: '**'
---

# Code Standards

## Naming and Language

- **Use English terms** - Variables, functions, classes, constants, and identifiers must be named in English.
- **Exception**: Comments and documentation can be in Portuguese, but code names always in English.

## Comments

- **Avoid adding comments in code** - Code should be self-explanatory through descriptive names of variables, functions, and components.
- Remove inline comments that explain logic - If code needs explanation, refactor it to be clearer.
- PHPDoc/JSDoc (docstrings) are allowed for public functions and complex components, but keep them concise.

## React - Best Practices

### Types/TypeScript

- **Always use types** - Every React component and hook must have explicit TypeScript types for props, state, and returns.
- **Organize types in dedicated files** - Types should always be in `resources/js/types/` in files with meaningful names that reflect their domain (e.g., `auth.ts`, `ui.ts`, `navigation.ts`).
- **Import types from organized files** - Do not define types inline; always import from `resources/js/types/`.

### Components

- **Use functional components with hooks** - Avoid class components. Always use functional components.
- **Use composition over inheritance** - Components should be composed from smaller components, not extended.
- **Memoize components when appropriate** - Use `React.memo` to avoid unnecessary re-renders in pure components.
- **Use Fragments** - Prefer `<>...</>` or `<React.Fragment>` to avoid unnecessary DOM elements.
- **Props with validation** - Use PropTypes to validate the props of each component.
- **Prioritize shadcn/ui components** - Use shadcn/ui components whenever possible for consistency and maintainability. If required components are not installed, suggest their installation.

### Hooks

- **Extract reusable logic into custom hooks** - Do not repeat logic across multiple components.
- **Use React hooks correctly** - Always declare hooks at the top of the component, never inside loops or conditions.
- **Descriptive names for custom hooks** - Start with `use` (e.g., `useUserData`, `useFetchData`).

### Lists and Keys

- **Always use keys in lists** - Never use the array index as a key.
- **Keys must be unique and stable** - Use IDs or unique identifiers from the data.

### Performance

- **Avoid unnecessary renders** - Use useCallback and useMemo when appropriate.
- **Lazy load components** - Use React.lazy and Suspense for heavy components.
- **Optimize state selectors** - In Redux or Context, create selectors to avoid re-renders on unnecessary changes.

### Component Structure

- **Separation of concerns** - Container and presentation components should be separated when appropriate.
- **Simple and direct props** - Avoid passing too many props; use composition or context when needed.
- **Descriptive names** - Component and function names should clearly describe their purpose (e.g., `UserCard`, `handleSubmit`, `isAuthenticated`).

### State and Effects

- **Keep state in the smallest scope possible** - Lift state only when necessary.
- **Focused effects** - Each `useEffect` should have a single responsibility.
- **Clean up effects** - Always clean up subscriptions, timeouts, and listeners in `useEffect` return.
- **Correct dependencies** - The `useEffect` dependency array must include all external variables used.

## PHP - Best Practices

### PHPDoc / PHPStan

- **Follow PHPStan docblock rules** - Always keep docblocks aligned with PHPStan static analysis rules.
- Docblocks should include parameter types, return types, and exceptions thrown when appropriate.
- Comments in docblocks must be in English.
- Keep documentation concise without redundant inline comments in code.
- Avoid creating tests unless requested.