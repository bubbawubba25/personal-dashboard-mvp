# Personal Dashboard MVP (React + Vite)

A simple, self-contained dashboard you can run locally or deploy to Vercel/Netlify.  
Features:
- Draggable/resizable widgets (react-grid-layout)
- Pages/Tabs (create, rename, delete, switch)
- Built-in widgets: To‑Do, Notes, Calendar
- Website Embed widget (via iframe) — note many sites (e.g., Gmail) block embedding

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev

# 3) Build for production
npm run build
npm run preview
```

## Deploying

- **Vercel:** Import the repo, no extra config needed (Vite auto-detected).
- **Netlify:** Set build command to `npm run build` and publish directory to `dist/`.

## Known Limitations

- Iframe embeds may be blocked by some sites via `X-Frame-Options` / `Content-Security-Policy`.
- Data is stored in `localStorage` (per browser). To make this multi-device with accounts, add a backend (e.g., Firebase) and sync the state there.
- Layout width uses `window.innerWidth` at render; for a production app, add a resize listener.

## Next Steps (Optional Enhancements)

- Firebase Auth + Firestore to store per-user dashboards.
- Granular sharing: publish a read-only view of a page.
- Theme editor, import/export, and widget marketplace.
