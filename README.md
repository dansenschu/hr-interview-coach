# HR Interview Coach

A polished demo web app for HR teams that generates structured interview guides
from a fictional job role and fictional candidate profile.

The app uses mock AI logic in the browser. It does not call any external API and
does not need API keys.

## Local Development

```bash
npm install
npm run dev
```

## GitHub Pages Build

```bash
npm run build:github
```

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` publishes the
static build from `dist-github`.
