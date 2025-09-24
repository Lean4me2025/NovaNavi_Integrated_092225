# NAVI Progress Tracker (Optional) — Bundle

This bundle implements an **opt‑in** Progress Tracker for NAVI. Users choose on first launch whether to enable it. The choice is saved locally and can be toggled later in **Settings**.

## Files
- `navi-welcome.html` — asks the user to enable the tracker (Enable / Not now)
- `navi-dashboard.html` — conditionally shows the tracker module; includes an "Enable Now" card when disabled
- `navi-settings.html` — toggle to enable/disable anytime

## Integrate
1. Place these files in your NAVI app root (or your `navi/` subfolder).
2. Link your router/navigation so **Welcome → Dashboard → Settings** flow is reachable:
   - Start at `navi-welcome.html`
   - Dashboard route is `navi-dashboard.html`
   - Settings route is `navi-settings.html`
3. If you already have a dashboard shell, move the conditional block from `navi-dashboard.html` (the `#trackerMount` section) into your existing layout.
4. Styling uses a dark blue theme and gold accent to match your brand. All styles are inline for simple drop-in; you can extract to your global CSS as needed.

## Data
- The flag is stored at `localStorage.naviProgressEnabled` with values `"true"` or `"false"`.
- No network calls — purely client-side; safe to test on Vercel static hosting.

— Prepared for Drew • 2025-09-23
