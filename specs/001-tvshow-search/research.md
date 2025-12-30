# Phase 0 Research: TV Show Search Web App

## Research Tasks

### Technology Best Practices

-   Best practices for:
    -   Tanstack Query in React apps
    -   Zod for runtime validation (with missing values allowed)
    -   Using shadcn/ui with Tailwind CSS
    -   Local Storage management for recently visited items
    -   Folder structure and code organization in modern React projects

### Integration Patterns

-   Integrating TVMaze public API with Tanstack Query and Zod
-   Handling missing/optional fields in API responses
-   Ensuring accessibility and responsiveness with shadcn/ui and Tailwind

## Research Findings

### 1. Tanstack Query Best Practices

-   **Decision**: Use Tanstack Query hooks for all async data fetching, keep query keys descriptive, and use query invalidation for cache updates.
-   **Rationale**: Ensures consistent async state, caching, and error handling. Query keys help with cache management.
-   **Alternatives considered**: Redux Toolkit Query (not needed for this scale), SWR (less feature-rich).

### 2. Zod for Runtime Validation

-   **Decision**: Use Zod schemas for all API data, with `.optional()` for fields that may be missing.
-   **Rationale**: Zod provides strong runtime validation and integrates well with TypeScript. `.optional()` ensures UI doesn't break on missing data.
-   **Alternatives considered**: Yup (less TypeScript-friendly), manual validation (error-prone).

### 3. shadcn/ui + Tailwind CSS

-   **Decision**: Use shadcn/ui components as base, customize with Tailwind utility classes.
-   **Rationale**: shadcn/ui is designed for Tailwind, provides accessible, composable UI primitives.
-   **Alternatives considered**: Material UI (heavier), Chakra UI (less Tailwind integration).

### 4. Local Storage for Recently Visited

-   **Decision**: Use a custom React hook to manage recently visited shows in local storage, with a cap (e.g., 20 items).
-   **Rationale**: Keeps logic reusable and testable. Capping prevents unbounded growth.
-   **Alternatives considered**: Context API (not persistent), Redux (overkill).

### 5. Folder Structure & Code Organization

-   **Decision**: Use the provided folder structure, with import alias `@/` for `src/`.
-   **Rationale**: Keeps codebase organized, scalable, and easy to navigate.
-   **Alternatives considered**: Flat structure (gets messy), deep nesting (hard to maintain).

### 6. TVMaze API Integration

-   **Decision**: Use Tanstack Query for all API calls, validate responses with Zod, handle missing fields gracefully.
-   **Rationale**: Ensures robust data handling and UI resilience.
-   **Alternatives considered**: Direct fetch (no caching/error handling), Axios (not needed with Tanstack Query).

### 7. Accessibility & Responsiveness

-   **Decision**: Use semantic HTML, shadcn/ui, and Tailwind responsive utilities. Test with screen readers and keyboard navigation.
-   **Rationale**: Meets constitution requirements for accessibility and modern UX.
-   **Alternatives considered**: None (mandatory).
