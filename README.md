# Traviz

Traviz is a travel organizer app for planning trips, schedules, notes, documents, and checklists in one place.

## What it does

- Create and manage trips
- Plan daily itineraries and activities
- Keep notes and checklists
- Store travel documents
- Edit trip details in one place

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase

## Setup

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```text
GEMINI_API_KEY=your_gemini_api_key_here
VITE_PUBLIC_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/   UI and shared components
├── features/     Feature-specific modules
├── pages/        App pages
├── lib/          API clients and helpers
├── stores/       State management
└── types/        TypeScript types
```

## Notes

- The app uses Supabase for auth and data.
