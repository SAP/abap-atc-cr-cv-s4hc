# Cloudification Repository Viewer

The viewer uses React, TypeScript and Vite. Use Node.js 20.19+ or 22.12+
(a current LTS release is recommended).

## Setup

From the repository root, generate the viewer data:

```sh
node scripts/generateContents.js
```

Then, from `viewer`, install the dependencies with `npm ci`.

## Available scripts

- `npm start`: start the development server at <http://localhost:3000>.
- `npm run typecheck`: check TypeScript without emitting files.
- `npm test`: open the interactive Cypress test runner.
- `npx cypress run`: run the Cypress tests headlessly with the server running.
- `npm run build`: type-check and build the production app into `build`.
- `npm run preview`: serve the production build at
  <http://localhost:3000/abap-atc-cr-cv-s4hc/>.
- `npm run deploy`: publish `build` with gh-pages.

Production assets use the `/abap-atc-cr-cv-s4hc/` GitHub Pages base path;
development runs at `/`. Static assets belong in `public`, and release JSON
files in the generated `src/data/contents` directory are bundled using Vite's
glob imports.
