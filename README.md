# Simulasi TKA SD — Vercel + Apps Script

## Routes
- `/` : pilih mapel
- `/bahasa` : Bahasa Indonesia
- `/matematika` : Matematika

## Vercel Environment Variables
Set these as server-side variables (do not prefix with `NEXT_PUBLIC_`):
- `APPS_SCRIPT_URL` = URL Web App Apps Script ending in `/exec`
- `API_SECRET` = same secret stored in Apps Script Script Properties

Redeploy after adding or changing environment variables. `api/submit.js` keeps the secret server-side and forwards each completed result to Apps Script.
