# Quickstart: TV Show Search Web App

## Prerequisites

-   Node.js (latest LTS recommended)

## Project Setup

1. **Clone the repository**
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Scaffold the app (if not already present)**
    ```bash
    npx spawn-react-app@latest
    ```
4. **Start the development server**
    ```bash
    npm run dev
    ```

## Tech Stack

-   React (TypeScript)
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   React Router v7
-   Tanstack Query
-   Zod

## Folder Structure

-   `src/components/` - Reusable UI components
-   `src/hooks/` - Custom React hooks
-   `src/pages/` - Page components for routing
-   `src/utils/` - Utility functions and helpers
-   `src/api/` - Data fetching and API logic
-   `src/types/` - TypeScript type definitions
-   `src/styles/` - Global styles and Tailwind config

## Coding Standards

-   Use functional components and React hooks
-   TypeScript only (no JS/JSX)
-   Named exports preferred
-   Use import alias `@/` for `src/`
-   Use Tailwind for styling, shadcn/ui for UI primitives
-   Follow accessibility and responsiveness best practices

## Useful Scripts

-   `npm run dev` - Start dev server
-   `npm run build` - Build the app

## API Reference

-   TVMaze: https://www.tvmaze.com/api

## Local Storage

-   Recently visited shows are managed in local storage (see data-model.md)

## Contribution

-   Follow code style and folder structure
-   All code changes require peer review
-   Feature branches must be up to date with main before merging
-   Releases are tagged and documented
