# NOVA + NAVI (Integrated SPA)
Unified single‑page app combining NOVA (trait discovery) and NAVI (resume/letter + role suggestions).

## Quick Start
1. Drag this folder into a GitHub repo (e.g., `NovaNavi_Integrated`).
2. Deploy on **Vercel** or **Netlify** as a static site (no build step needed).
3. Open the site and navigate:
   - `#/nova` to select traits (50 available; search + multi-select).
   - `#/result` to see your NOVA snapshot.
   - `#/navi` to draft resume/cover letter and view role suggestions.
   - `#/plans` to show Payhip embeds (Starter, Pro Suite pre‑wired; others placeholders).

## Payhip IDs
- Starter: `GdfU7` ✅
- Pro Suite: `re4Hy` ✅
- Purpose Book: `REPLACE_BOOK_ID` (update both href and data-product)
- Mastery: `REPLACE_MASTERY_ID` (update both href and data-product)

## Customize
- Edit `data/traits.json` to adjust trait list (keep 50+ entries).
- Edit `data/roles.json` to tune role suggestions and signals.
- Update colors in `styles.css` under `:root`.

## Notes
- SPA uses **hash routing**. No backend required.
- All selections live in memory (`app.js` state). Hook to a backend later if desired.
- Tested for modern evergreen browsers.

© 2025 NOVA + NAVI
