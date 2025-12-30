# Tasks: TV Show Search Web App

## Phase 1: Setup

-   [ ] T001 Initialize Vite+React+TypeScript app (npx spawn-react-app@latest)
-   [ ] T002 Install dependencies: React Router v7, Tanstack Query, Zod

## Phase 2: Foundational

-   [ ] T003 Create TypeScript types for TVShow, Season, Episode, CastMember, Image, RecentlyVisitedShow in src/types/
-   [ ] T004 Create Zod schemas for all API data in src/types/
-   [ ] T005 Set up Tanstack Query provider and React Router in src/main.tsx
-   [ ] T006 Implement local storage utility for recently visited shows in src/utils/

## Phase 3: User Story 1 - Search for TV Shows (P1)

-   [ ] T007 [US1] Create SearchBar component in src/components/SearchBar.tsx
-   [ ] T008 [US1] Create ShowCard component in src/components/ShowCard.tsx
-   [ ] T009 [US1] Create SearchPage in src/pages/SearchPage.tsx
-   [ ] T010 [US1] Implement search logic using TVMaze API and Tanstack Query in src/api/search.ts
-   [ ] T011 [US1] Display search results in a responsive grid in SearchPage
-   [ ] T012 [US1] Handle empty state (no results) in SearchPage
-   [ ] T013 [US1] Ensure search bar is pre-populated with last search term
-   [ ] T014 [US1] Add navigation from ShowCard to DetailsPage

## Phase 4: User Story 2 - Recently Visited Shows (P2)

-   [ ] T015 [US2] Create HomePage in src/pages/HomePage.tsx
-   [ ] T016 [US2] Display recently visited shows in a grid using ShowCard
-   [ ] T017 [US2] Implement logic to add/update show in recently visited (local storage) when visiting details
-   [ ] T018 [US2] Implement remove (cross) icon on ShowCard to remove from recently visited
-   [ ] T019 [US2] Handle empty state (no recently visited) in HomePage

## Phase 5: User Story 3 - View Show Details (P3)

-   [ ] T020 [US3] Create DetailsPage in src/pages/DetailsPage.tsx
-   [ ] T021 [US3] Fetch and display all show details (images, info, cast, seasons, episodes) in DetailsPage
-   [ ] T022 [US3] Handle missing/optional data gracefully in DetailsPage
-   [ ] T023 [US3] Implement back button logic (previous page or home)
-   [ ] T024 [US3] Group episodes by season in DetailsPage

## Phase 6: Polish & Cross-Cutting

-   [ ] T025 Add dark mode and modern gradients to UI (Tailwind config and styles)
-   [ ] T026 Ensure all UI is responsive and accessible (keyboard, screen reader)
-   [ ] T027 Add jsdoc comments to complex functions/components
-   [ ] T028 Add error boundaries and friendly error messages for not found/API errors
-   [ ] T029 Add unit and integration tests for components and hooks (Vitest, React Testing Library, MSW)
-   [ ] T030 Review and update documentation (quickstart.md, data-model.md)

## Dependencies

-   User Story 1 (Search) must be completed before User Story 2 (Recently Visited) and User Story 3 (Details)
-   User Story 2 and 3 can be developed in parallel after foundational setup

## Parallel Execution Examples

-   T018 [US2] HomePage and T023 [US3] DetailsPage can be implemented in parallel
-   T011 [US1] ShowCard can be reused in both HomePage and SearchPage

## Implementation Strategy

-   MVP: Complete all tasks for User Story 1 (Search for TV Shows)
-   Incrementally deliver User Story 2 (Recently Visited) and User Story 3 (Details)
-   Polish and cross-cutting tasks after core flows are working
