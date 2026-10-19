# Demo deployment

Live production demo: [miguel-personal-style.vercel.app](https://miguel-personal-style.vercel.app/).

The Vercel project is `miguel-personal-style`, connected to [the GitHub repository](https://github.com/miguelcorderocollar/miguel-personal-style). The `main` branch is the production branch. Git pushes use Vercel's Git integration; the initial production release was deployed with the Vercel CLI.

## Static build

```bash
npm run build
```

The dependency-free Node script copies the skill's assets into `public/assets/` and generates `public/index.html` from the canonical showcase. The root page's parent-relative asset paths are rebased to `/assets/`, so fonts, modules, shaders, licences, SVG exports and hash navigation work at `/`.

The installable skill remains in `skills/miguel-personal-style/`; there is no second hand-maintained demo. Generated output, local Vercel settings and review files are ignored by Git and excluded from CLI uploads.

To inspect the built page locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8000/`, including `/#components`, `/#assets` or `/#motion` for a specific tab.

## Vercel CLI

Authenticate with the Vercel CLI and select the intended team before linking:

```bash
vercel link --project miguel-personal-style --scope <your-team>
vercel project inspect --non-interactive
vercel git connect https://github.com/miguelcorderocollar/miguel-personal-style.git
vercel deploy --prod
```

`vercel.json` selects the static framework preset, runs `npm run build`, and serves `public/`. No runtime secrets, database or server functions are required.

After deploying, verify the root page, fonts, all eight interaction recipes, native surfaces, SVG export, hash navigation and a narrow viewport. A root-page reload must retain its selected tab without changing to an asset-directory URL.
