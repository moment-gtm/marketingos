# GTM Control Tower

A synthetic, rule-based growth/marketing control-tower dashboard for Dr Pepper-style brands across US, Canada, Mexico, and UK & Export markets. No live integrations — all data is generated client-side from a fixed seed.

## Live site

**https://moment-gtm.github.io/marketingos/**

The site sits behind a login gate (client-side only — see [Security note](#security-note)).

## Tech stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (utility classes, mixed with inline style tokens)
- [Recharts](https://recharts.org/) for charts
- [lucide-react](https://lucide.dev/) for icons
- Hosted as a static build on **GitHub Pages**, served from the `gh-pages` branch

## Project structure

```
GrowthControlTower.jsx   # the dashboard itself (single large component)
src/
  App.jsx                # auth gate wrapper
  Login.jsx              # login form
  main.jsx               # app entry point
  index.css              # Tailwind entry
index.html
vite.config.js           # base path set to /marketingos/ for GitHub Pages
```

## Local development

```bash
npm install
npm run dev      # starts Vite dev server at http://localhost:5173/marketingos/
```

## Build

```bash
npm run build     # outputs static files to dist/
npm run preview   # preview the production build locally
```

## Deploying to GitHub Pages

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes it to GitHub Pages. The same workflow can also be started manually from the Actions tab.

```bash
git push origin main
```

GitHub Pages must use **GitHub Actions** as its build and deployment source.

## Security note

The login gate is a lightweight speed bump for an internal demo, **not real access control**. This is a static site with no backend, so:

- The credential pair is visible in this README and in the repo source.
- It's also baked into the shipped JS bundle and readable via browser dev tools.

Real authentication would require a backend (e.g. a serverless function or hosted auth provider) — GitHub Pages only serves static files.
