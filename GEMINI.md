# Project Overview: mylink

This is a Next.js application (version 16.2.6) bootstrapped with `create-next-app`. It uses the App Router and leverages modern React features.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (v16.2.6)
- **Library:** [React](https://react.dev) (v19.2.4)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
- **Language:** [TypeScript](https://www.typescriptlang.org) (v5)
- **Linting:** [ESLint](https://eslint.org) (v9)

## Building and Running

The following scripts are available in `package.json`:

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Development Conventions

### Breaking Changes & Internal Documentation
**IMPORTANT:** This version of Next.js contains breaking changes. APIs, conventions, and file structure may differ from standard training data.
- Always refer to the internal documentation located at `node_modules/next/dist/docs/` for accurate and up-to-date guidance.
- Heed any deprecation notices encountered during development.

### Navigation Optimization
- If you are tasked with fixing slow client-side navigations, exported `unstable_instant` from the route in addition to using `Suspense`. Refer to `docs/01-app/02-guides/instant-navigation.mdx` for more details.

### Styling
- The project uses Tailwind CSS 4. Prefer using utility classes for styling.
- Global styles are located in `src/app/globals.css`.

### Font Optimization
- This project uses `next/font` with the Geist and Geist Mono font families.

## Project Structure

- `src/app/`: Contains the application routes, layouts, and global styles (App Router).
- `public/`: Static assets like images and SVGs.
- `next.config.ts`: Next.js configuration file.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.mjs`: ESLint configuration.
