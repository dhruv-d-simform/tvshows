# TV Shows - Search and Explore

A modern, user-friendly web application for searching and exploring TV shows using the TVMaze API.

## Features

✨ **Search TV Shows** - Search for your favorite TV shows with real-time results
📺 **Show Details** - View comprehensive information including cast, seasons, and episodes
🕒 **Recently Visited** - Keep track of shows you've recently viewed
🎨 **Modern Dark UI** - Beautiful dark mode interface with modern gradients
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
♿ **Accessible** - Keyboard navigation and screen reader support

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router v7** - Client-side routing
- **Tanstack Query** - Async state management
- **Zod** - Runtime validation

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)

### Installation

1. Clone the repository
2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── api/           # API functions and Tanstack Query hooks
├── components/    # Reusable UI components
├── pages/         # Page components (HomePage, SearchPage, DetailsPage)
├── types/         # TypeScript types and Zod schemas
├── utils/         # Utility functions (localStorage management)
└── styles/        # Global styles and Tailwind config
```

## Features in Detail

### Search

- Real-time search with TVMaze API
- Responsive grid layout for results
- Show cards with ratings, genres, and summaries
- Empty state handling

### Show Details

- Full show information with background images
- Cast members with photos
- Seasons and episodes grouped by season
- IMDb integration
- Back navigation

### Recently Visited

- Automatic tracking of viewed shows
- Stored in local storage
- Remove shows with one click
- Empty state with quick navigation to search

## Code Style

- Functional components with React hooks
- Named exports preferred
- TypeScript only (no JavaScript files)
- Import alias `@/` for `src/` directory
- JSDoc comments for complex functions
- Semantic HTML for accessibility

## API

This app uses the [TVMaze API](https://www.tvmaze.com/api) for all TV show data.

## License

MIT

## Contributing

1. Follow the code style guidelines
2. Ensure all changes are properly typed
3. Test responsiveness on mobile and desktop
4. Keep accessibility in mind
