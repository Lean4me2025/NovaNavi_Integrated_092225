# NOVA + NAVI • Full Flow v1.5

**Build time:** 2025-09-28T15:28:18

An integrated, single-upload bundle for NOVA → NAVI:

Flow: **Welcome → Category → Traits → Results → Reflection → Plan → NAVI**

## Files
- `index.html` — App shell & screens
- `styles.css` — Dark theme + components
- `app.js` — Router, state, sample logic, Payhip activation

## Payhip Buttons
Already wired:
- **Purpose Book**: `N7Lvg`
- **Mastery (NAVI Pro Suite)**: `re4Hy`

To activate the other plans, open `app.js` and set:
```js
const PAYHIP_IDS = {
  BOOK: "N7Lvg",
  STARTER: "YOUR_STARTER_ID",
  PRO: "YOUR_PRO_ID",
  MASTERY: "re4Hy"
};
```
Then deploy — buttons upgrade automatically.

## Optional Breadcrumb
A breadcrumb bar is included but **hidden by default**. To enable, remove the `hidden` class on `<nav id="breadcrumb">` or toggle it in JS, and call:
```js
// Example: set current step
// document.getElementById('breadcrumb').classList.remove('hidden');
// goTo('category');
```

## Notes
- Trait grid = 50 items (styled, selectable, with a max of 10).
- State is persisted in `localStorage` so **Resume** link works.
- Screens are pure front-end — no server needed.
- Replace the sample result logic in `computeResults()` with your category→role mapping when ready.
