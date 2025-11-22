Frontend local dev & deploy (Windows PowerShell)

Dev server (Expo web)

1. Install dependencies (first time):
   cd frontend
   npm ci --legacy-peer-deps

2. Start Expo web dev server (development):
   npm run web

   - The Metro/Expo dev server will start and provide a local URL (usually http://localhost:19006).
   - If you want the mobile simulator/emulator use `npm run ios` or `npm run android` with Expo installed.

Production web build

1. From the `frontend` folder run:
   npm run build

2. The production build will be written to `frontend/web-build/` (this is what Netlify will publish).

Quick deploy script

We've added a PowerShell convenience script: `deploy-to-netlify.ps1` in the `frontend` folder.

Usage (PowerShell):

- Interactive deploy (you'll be prompted by Netlify CLI if needed):
  cd frontend; .\deploy-to-netlify.ps1

- Non-interactive deploy (set env vars first):
  $env:NETLIFY_AUTH_TOKEN = '<your-token>'
  $env:NETLIFY_SITE_ID = '<your-site-id>'
  cd frontend; .\deploy-to-netlify.ps1

Notes

- Netlify CLI: If not installed globally, the script will attempt to use `npx netlify`. If that is not available, it will print instructions.
- If the build fails due to missing dev dependencies, run `npm ci --legacy-peer-deps` to re-install deps and try again.
- The project uses Expo and react-native-web; large asset warnings may appear during the build but the build can still succeed. Consider optimizing large images and font subsets for better performance.
