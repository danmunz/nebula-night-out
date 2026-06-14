# Nebula Night Out

A cosmic-themed dating app built with React, TypeScript, and Vite.

🚀 **Live app:** [https://danmunz.github.io/nebula-night-out/](https://danmunz.github.io/nebula-night-out/)

## Development

```bash
npm install
npm run dev
```

## Deployment

The app is deployed automatically to [GitHub Pages](https://danmunz.github.io/nebula-night-out/) on every push to `main` via the `.github/workflows/deploy.yml` workflow.

The workflow:
1. Runs CI checks (type-check, lint, tests, build)
2. Uploads the `dist/` folder as a Pages artifact
3. Deploys to `https://danmunz.github.io/nebula-night-out/`

To deploy manually, trigger the workflow from the [Actions tab](../../actions/workflows/deploy.yml).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run typecheck` | Run TypeScript type-checking |
