---
applyTo: '**'
---

# GitHub Copilot Instructions

## Tech Stack Overview

-   This is a React application written in TypeScript.
-   The UI uses Tailwind CSS and shadcn/ui components.
-   React Router v7 is used for routing.
-   Tanstack Query will be used for async state management and fetching data from the mock data layer.
-   Zod will be used for runtime validation of data coming from API, but with allowing missing value.

## Code Style Standards

-   Use functional components and React hooks.
-   Use TypeScript for type safety. Do not use `any` type. Do not create `.js/.jsx` files.
-   Use **named exports** where possible. Default exports only when it makes clear sense (e.g., lazy loading).
-   Keep components small and focused. Follow the Single Responsibility Principle.
-   Separate components, hooks, and utilities into their own files.
-   Use `jsdoc` comments for complex functions and components whenever necessary.
-   Use import alias `@/` to refer to the `src/` directory. Avoid use of relative paths like `../../../`.
-   Use PascalCase for component names.
-   Use camelCase for variables and functions.
-   Use SCREAMING_SNAKE_CASE for constants.
-   Use meaningful variable and function names.

## Folder Structure

-   `src/components/` - Reusable UI components.
-   `src/hooks/` - Custom React hooks.
-   `src/pages/` - Page components for routing.
-   `src/utils/` - Utility functions and helpers.
-   `src/api/` - Mock data layer functions.
-   `src/types/` - TypeScript type definitions.
-   `src/styles/` - Global styles and Tailwind configuration.

## UI & Styling

-   Use **Tailwind CSS** for styling. Do **not** use inline styles except for very rare edge cases.
-   Prefer schemantic HTML (`button`, `nav`, `main`, `section`, etc.) for better accessibility.
-   Use **shadcn/ui** components as the default building blocks for UI: buttons, inputs, dialogs, dropdowns, etc.
